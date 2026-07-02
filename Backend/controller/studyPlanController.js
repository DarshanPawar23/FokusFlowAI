import db from "../db/db.js";
import { 
  generateAdaptiveStudyPlan, 
} from "../services/adaptivePlannerService.js" 
import { generateAdaptiveReschedule } from "../services/adaptiveReschedulerService.js";

export const createStudyPlan = async (req, res) => {
  try {
    console.log("========== CREATE STUDY PLAN ==========");

    const { playlistId, targetDays } = req.body;
    const userId = req.user.id;

    console.log("Request Body:", req.body);
    console.log("User ID:", userId);

    // -----------------------------
    // Get Playlist
    // -----------------------------
    const [playlistRes] = await db.query(
      `SELECT structured_data, overview_data
       FROM playlists
       WHERE id = ? AND user_id = ?`,
      [playlistId, userId]
    );

    console.log("Playlist Result:", playlistRes);

    if (playlistRes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found."
      });
    }

    const structuredCourse =
      typeof playlistRes[0].structured_data === "string"
        ? JSON.parse(playlistRes[0].structured_data)
        : playlistRes[0].structured_data;

    const overview =
      typeof playlistRes[0].overview_data === "string"
        ? JSON.parse(playlistRes[0].overview_data)
        : playlistRes[0].overview_data;

    const courseTitle =
      overview?.courseTitle ||
      overview?.title ||
      "Course";

    console.log("Course Title:", courseTitle);

    // -----------------------------
    // Calculate Course Stats
    // -----------------------------
    let totalVideos = 0;
    let totalSeconds = 0;

    structuredCourse.forEach(section => {
      section.videos.forEach(video => {
        totalVideos++;
        totalSeconds += video.duration_seconds || 600;
      });
    });

    const totalHours = +(totalSeconds / 3600).toFixed(2);

    console.log({
      totalVideos,
      totalHours
    });

    // -----------------------------
    // Generate AI Plan
    // -----------------------------
    console.log("Generating AI Study Plan...");

    const aiPlan = await generateAdaptiveStudyPlan({
      courseTitle,
      totalVideos,
      totalHours,
      targetDays,
      structuredCourse
    });

    console.log("AI PLAN:");
    console.dir(aiPlan, { depth: null });

    if (!aiPlan.possible) {
      return res.status(400).json({
        success: false,
        message: aiPlan.message
      });
    }

    // -----------------------------
    // Start Transaction
    // -----------------------------
    console.log("Starting Transaction...");
    await db.query("START TRANSACTION");

    const deadlineDate = new Date();
    deadlineDate.setDate(
      deadlineDate.getDate() + aiPlan.summary.completionDays
    );

    console.log("Deadline:", deadlineDate);

    // -----------------------------
    // Insert Study Plan
    // -----------------------------
    const [planInsert] = await db.query(
      `INSERT INTO study_plans
      (
        user_id,
        playlist_id,
        target_days,
        estimated_hours,
        daily_hours,
        total_videos,
        remaining_videos,
        deadline
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        playlistId,
        targetDays,
        totalHours,
        aiPlan.summary.dailyHours,
        totalVideos,
        totalVideos,
        deadlineDate
      ]
    );

    console.log("Study Plan Inserted");
    console.log(planInsert);

    const planId = planInsert.insertId;

    // -----------------------------
    // Build Schedule
    // -----------------------------
    const scheduleValues = aiPlan.schedule.map((day, index) => {

      const studyDate = new Date();
      studyDate.setDate(studyDate.getDate() + index);

      return [
        planId,
        day.day,
        studyDate,
        day.goal,
        JSON.stringify(day.videos),
        day.studyHours,
        day.revisionMinutes,
        day.priority,
        day.catchUp,
        day.videos.length
      ];
    });

    console.log("Schedule Values:");
    console.dir(scheduleValues, { depth: null });

    // -----------------------------
    // Insert Schedule
    // -----------------------------
    await db.query(
      `INSERT INTO study_schedule
      (
        plan_id,
        day_number,
        study_date,
        goal,
        videos,
        study_hours,
        revision_minutes,
        priority,
        catch_up,
        remaining_videos
      )
      VALUES ?`,
      [scheduleValues]
    );

    console.log("Schedule Inserted");

    // -----------------------------
    // Commit
    // -----------------------------
    await db.query("COMMIT");

    console.log("Transaction Committed");

    return res.status(201).json({
      success: true,
      planId,
      data: aiPlan
    });

  } catch (error) {

    console.log("==================================");
    console.log("CREATE STUDY PLAN ERROR");
    console.log("==================================");

    console.error(error);

    // Safe Rollback
    try {
      await db.query("ROLLBACK");
      console.log("Rollback Successful");
    } catch (rollbackError) {
      console.error("Rollback Failed:", rollbackError.message);
    }

    return res.status(500).json({
      success: false,
      message: error.message,
      stack: process.env.NODE_ENV === "development"
        ? error.stack
        : undefined
    });
  }
};

export const reschedulePlan = async (req, res) => {
  const { planId } = req.params;
  const userId = req.user.id;

  try {
    const [planRes] = await db.query(
      `SELECT * FROM study_plans WHERE id = ? AND user_id = ?`,
      [planId, userId]
    );

    if (planRes.length === 0) {
      return res.status(404).json({ success: false, message: "Study plan not found." });
    }

    const plan = planRes[0];

    const [playlistRes] = await db.query(
      `SELECT overview_data FROM playlists WHERE id = ?`,
      [plan.playlist_id]
    );

    const overview = typeof playlistRes[0].overview_data === 'string'
      ? JSON.parse(playlistRes[0].overview_data)
      : playlistRes[0].overview_data;

    const courseTitle = overview?.courseTitle || overview?.title || "Course";

    const [scheduleRes] = await db.query(
      `SELECT * FROM study_schedule WHERE plan_id = ? AND completed = FALSE ORDER BY day_number ASC`,
      [planId]
    );

    if (scheduleRes.length === 0) {
      return res.status(400).json({ success: false, message: "No pending schedule to update." });
    }

    const remainingHours = scheduleRes.reduce((acc, curr) => acc + curr.study_hours, 0);
    const newRemainingVideos = scheduleRes.reduce((acc, curr) => acc + curr.remaining_videos, 0);
    
    const today = new Date();
    const deadlineDate = new Date(plan.deadline);
    const daysRemaining = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

    const futureSchedule = scheduleRes.map(day => ({
      day: day.day_number,
      goal: day.goal,
      videos: typeof day.videos === 'string' ? JSON.parse(day.videos) : day.videos,
      studyHours: day.study_hours
    }));

    const aiUpdate = await generateAdaptiveReschedule({
      courseTitle, 
      totalHours: plan.estimated_hours,
      originalDeadline: plan.target_days,
      daysRemaining: Math.max(daysRemaining, 1),
      completedVideos: plan.completed_videos,
      remainingVideos: plan.remaining_videos,
      completedDays: plan.completed_days,
      missedDays: plan.missed_days,
      remainingHours,
      futureSchedule
    });

    if (!aiUpdate.possible) {
      return res.status(400).json({ success: false, message: aiUpdate.message });
    }

    await db.query("START TRANSACTION");

    await db.query(`DELETE FROM study_schedule WHERE plan_id = ? AND completed = FALSE`, [planId]);

    const newScheduleValues = aiUpdate.schedule.map((day, index) => {
      const studyDate = new Date();
      studyDate.setDate(studyDate.getDate() + index); 
      
      return [
        planId,
        day.day,
        studyDate,
        day.goal,
        JSON.stringify(day.videos),
        day.studyHours,
        day.revisionMinutes,
        day.priority,
        day.catchUp,
        day.videos.length
      ];
    });

    await db.query(
      `INSERT INTO study_schedule 
      (plan_id, day_number, study_date, goal, videos, study_hours, revision_minutes, priority, catch_up, remaining_videos) 
      VALUES ?`,
      [newScheduleValues]
    );

    await db.query(
      `UPDATE study_plans SET daily_hours = ?, remaining_videos = ? WHERE id = ?`, 
      [aiUpdate.summary.dailyHours, newRemainingVideos, planId]
    );

    await db.query("COMMIT");

    res.status(200).json({ success: true, message: "Schedule updated successfully.", data: aiUpdate });

  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Reschedule Error:", error);
    res.status(500).json({ success: false, message: "Server Error during rescheduling." });
  }
};

export const getStudyPlan = async (req, res) => {
  const userId = req.user.id;
  const { playlistId } = req.params;

  try {

    const [planRes] = await db.query(
      `
      SELECT
        sp.*,
        p.overview_data
      FROM study_plans sp
      JOIN playlists p
        ON sp.playlist_id = p.id
      WHERE sp.user_id = ?
      AND sp.playlist_id = ?
      `,
      [userId, playlistId]
    );

    if (planRes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Study plan not found."
      });
    }

    const plan = planRes[0];

    const overview =
      typeof plan.overview_data === "string"
        ? JSON.parse(plan.overview_data)
        : plan.overview_data;

    const courseTitle =
      overview?.courseTitle ||
      overview?.title ||
      "Course";

    // Get Daily Schedule
    const [schedule] = await db.query(
      `
      SELECT
        id,
        day_number,
        study_date,
        goal,
        videos,
        study_hours,
        revision_minutes,
        priority,
        catch_up,
        completed,
        missed,
        remaining_videos,
        notes
      FROM study_schedule
      WHERE plan_id=?
      ORDER BY day_number
      `,
      [plan.id]
    );

    const formattedSchedule = schedule.map(day => ({
      ...day,
      videos:
        typeof day.videos === "string"
          ? JSON.parse(day.videos)
          : day.videos
    }));

    return res.json({
      success: true,

      studyPlan: {

        planId: plan.id,

        courseTitle,

        startDate: plan.created_at,

        deadline: plan.deadline,

        targetDays: plan.target_days,

        estimatedHours: plan.estimated_hours,

        dailyHours: plan.daily_hours,

        totalVideos: plan.total_videos,

        completedVideos: plan.completed_videos,

        remainingVideos: plan.remaining_videos,

        completedDays: plan.completed_days,

        missedDays: plan.missed_days,

        currentDay: plan.current_day,

        status: plan.status,

        schedule: formattedSchedule
      }
    });

  } catch (error) {

    console.error("Get Study Plan Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

