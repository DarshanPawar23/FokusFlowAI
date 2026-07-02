import db from "../db/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { generateStructure } from "../services/geminiService.js";
import { fetchCourseNotes } from "../services/notesService.js";
import { generateOverview } from "../services/courseOverviewService.js";
import { generateExamQuestions } from "../services/examQuestionService.js";
import { generateAITutorResponse } from "../services/aiTutorService.js";
import { generateRecommendedQuestions } from "../services/generateRecommendedQuestions.js";

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }
    const [existingUser] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await db.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword]
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully"
    });
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }
    const [user] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    const isMatch = await bcrypt.compare(
      password,
      user[0].password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }
    const token = jwt.sign(
      {
        id: user[0].id,
        email: user[0].email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token
    });
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const addPlaylist = async (req, res) => {
  try {
    const { link } = req.body;
    const userId = req.user.id;

    if (!link || !link.includes("list=")) {
      return res.status(400).json({
        success: false,
        message: "Invalid playlist link"
      });
    }

    const playlistId = new URL(link).searchParams.get("list");

    if (!playlistId) {
      return res.status(400).json({
        success: false,
        message: "Invalid playlist ID"
      });
    }
    const [existing] = await db.query(
      "SELECT id FROM playlists WHERE user_id = ? AND youtube_playlist_id = ?",
      [userId, playlistId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Course already added"
      });
    }
    const ytResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=${process.env.YT_API_KEY}`
    );

    const ytData = await ytResponse.json();

    if (!ytData.items || ytData.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Playlist not found"
      });
    }

    const videoData = ytData.items.map(item => ({
      title: item.snippet.title,
      videoId: item.contentDetails.videoId
    }));

    const thumbnail =
      ytData.items[0]?.snippet?.thumbnails?.high?.url ||
      ytData.items[0]?.snippet?.thumbnails?.medium?.url ||
      ytData.items[0]?.snippet?.thumbnails?.default?.url ||
      "";
    const structured = await generateStructure(videoData);

    const totalVideos = videoData.length;
    const totalMinutes = totalVideos * 15;

    const overview = await generateOverview(structured, totalMinutes);
    const [result] = await db.query(
      `INSERT INTO playlists 
      (user_id, youtube_playlist_id, structured_data, overview_data) 
      VALUES (?, ?, ?, ?)`,
      [
        userId,
        playlistId,
        JSON.stringify(structured),
        JSON.stringify(overview)
      ]
    );

    const insertedId = result.insertId;

    return res.status(201).json({
      success: true,
      playlistId: insertedId,
      structured,
      overview,
      thumbnail
    });

  } catch (error) {
    console.error("addPlaylist error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const getCurrentCourse = async (req, res) => {
  try {
    const [course] = await db.query(
      `SELECT structured_data, overview_data 
             FROM playlists 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT 1`,
      [req.user.id]
    );

    if (course.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No course found"
      });
    }

    return res.status(200).json({
      success: true,
      structured:
        typeof course[0].structured_data === "string"
          ? JSON.parse(course[0].structured_data)
          : course[0].structured_data,
      overview:
        typeof course[0].overview_data === "string"
          ? JSON.parse(course[0].overview_data)
          : course[0].overview_data
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const addNote = async (req, res) => {
  try {
    const { playlistId, videoId, noteText, timestamp } = req.body;
    const userId = req.user.id;

    if (!playlistId || !videoId || !noteText) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    await db.query(
      `INSERT INTO lecture_notes 
       (user_id, playlist_id, video_id, note_text, timestamp_seconds)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, playlistId, videoId, noteText, timestamp || 0]
    );

    return res.json({
      success: true,
      message: "Note saved successfully"
    });

  } catch (error) {
    console.error("Add Note Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { playlistId, videoId, type } = req.query;

    if (!playlistId) {
      return res.status(400).json({
        success: false,
        message: "playlistId is required"
      });
    }

    let query = `
      SELECT id, video_id, note_text, timestamp_seconds, created_at
      FROM lecture_notes
      WHERE user_id = ? AND playlist_id = ?
    `;

    const values = [userId, playlistId];

    
    if (type === "current" && videoId) {
      query += " AND video_id = ?";
      values.push(videoId);
    }

    query += " ORDER BY created_at DESC";

    const [notes] = await db.query(query, values);

    return res.json({
      success: true,
      count: notes.length,
      notes
    });

  } catch (error) {
    console.error("Get Notes Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const createExam = async (req, res) => {
  try {
    const userId = req.user.id;

    const [playlist] = await db.query(
      "SELECT id, structured_data FROM playlists WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
      [userId]
    );

    if (playlist.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No course found"
      });
    }

    const playlistId = playlist[0].id;

    const [existing] = await db.query(
      "SELECT id FROM exams WHERE playlist_id = ? ORDER BY created_at DESC LIMIT 1",
      [playlistId]
    );

    if (existing.length > 0) {
      return res.json({
        success: true,
        examId: existing[0].id,
        message: "Using existing exam"
      });
    }

    const structured = typeof playlist[0].structured_data === "string"
      ? JSON.parse(playlist[0].structured_data)
      : playlist[0].structured_data;

    const courseTitle = structured[0]?.sectionTitle || "Course Exam";

    const questions = await generateExamQuestions(courseTitle, structured);

    if (!questions || questions.length === 0) {
      return res.status(500).json({
        success: false,
        message: "No questions generated"
      });
    }

    const [examResult] = await db.query(
      "INSERT INTO exams (playlist_id, title, total_questions) VALUES (?, ?, ?)",
      [playlistId, `${courseTitle} Final Exam`, questions.length]
    );

    const examId = examResult.insertId;

    for (const q of questions) {
      if (!q.question || !q.options || q.correctIndex === undefined) continue;

      await db.query(
        "INSERT INTO questions (exam_id, question_text, options, correct_answer) VALUES (?, ?, ?, ?)",
        [
          examId,
          q.question,
          JSON.stringify(q.options),
          q.correctIndex
        ]
      );
    }

    return res.json({
      success: true,
      examId,
      totalQuestions: questions.length
    });

  } catch (error) {
    console.error(" Create Exam Error:", error);

    if (error.status === 429 || error.message?.includes("429")) {
      return res.status(429).json({
        success: false,
        message: "AI Rate limit reached. Please wait 60 seconds."
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const submitExam = async (req, res) => {
  try {
    const userId = req.user.id;
    const { examId, answers } = req.body;
    const [[exam]] = await db.query(
      "SELECT playlist_id FROM exams WHERE id = ?",
      [examId]
    );

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    const playlistId = exam.playlist_id;

    const [questions] = await db.query(
      "SELECT correct_answer FROM questions WHERE exam_id = ?",
      [examId]
    );

    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct_answer) score++;
    });

    const total = questions.length;
    const percentage = (score / total) * 100;
    const passed = percentage >= 60;
    const [existing] = await db.query(
      "SELECT * FROM exam_attempts WHERE user_id = ? AND playlist_id = ?",
      [userId, playlistId]
    );

    if (existing.length > 0) {
      await db.query(
        `UPDATE exam_attempts 
         SET score = ?, percentage = ?, attempts = attempts + 1 
         WHERE user_id = ? AND playlist_id = ?`,
        [score, percentage, userId, playlistId]
      );
    } else {
      await db.query(
        `INSERT INTO exam_attempts 
        (user_id, exam_id, playlist_id, score, percentage) 
        VALUES (?, ?, ?, ?, ?)`,
        [userId, examId, playlistId, score, percentage]
      );
    }

    if (passed) {
      await db.query(
        "UPDATE exams SET status = 'completed' WHERE id = ?",
        [examId]
      );
    }

    res.json({
      success: true,
      score,
      total,
      percentage,
      passed,
      allowRetake: !passed
    });

  } catch (error) {
    console.error("Submit Exam Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    const [data] = await db.query(`
      SELECT 
        p.id as playlistId,
        p.youtube_playlist_id,
        e.id as examId,
        ea.score,
        ea.percentage,
        ea.attempts
      FROM playlists p
      LEFT JOIN exams e ON e.playlist_id = p.id
      LEFT JOIN exam_attempts ea 
        ON ea.playlist_id = p.id AND ea.user_id = ?
      WHERE p.user_id = ?
    `, [userId, userId]);

    res.json({ success: true, data });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getExamQuestions = async (req, res) => {
  try {
    const { examId } = req.params;

    const [questions] = await db.query(
      "SELECT id, question_text, options FROM questions WHERE exam_id = ?",
      [examId]
    );

    res.json({
      success: true,
      questions
    });

  } catch (error) {
    console.error("Get Questions Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const askAITutor = async (req, res) => {
  try {
    const { question, transcript, videoTitle } = req.body;

    if (!transcript) {
      return res.status(400).json({
        success: false,
        message: "Transcript is required"
      });
    }

    const result = await generateAITutorResponse({
      question,
      transcript,
      videoTitle
    });

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error("AI Tutor Controller Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { playlistId } = req.params;

    await db.query(
      "DELETE FROM playlists WHERE id = ? AND user_id = ?",
      [playlistId, userId]
    );

    res.json({ success: true, message: "Course removed" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const [courses] = await db.query(
      `SELECT id, youtube_playlist_id, structured_data, created_at, thumbnail
       FROM playlists 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      courses: courses.map(c => ({
        id: c.id,
        youtube_playlist_id: c.youtube_playlist_id,
        thumbnail: c.thumbnail, // Ensure this is explicitly passed
        created_at: c.created_at,
        structured_data: typeof c.structured_data === "string"
          ? JSON.parse(c.structured_data)
          : c.structured_data
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecommendedQuestions = async (req, res) => {
  try {
    const { transcript, videoTitle } = req.body;

    console.log("Incoming:", { transcript, videoTitle });

    const data = await generateRecommendedQuestions({
      transcript,
      videoTitle
    });

    console.log(" AI Response:", data);

    res.json({
      success: true,
      questions: data.questions
    });

  } catch (err) {
    console.error("Controller Error:", err.message);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};