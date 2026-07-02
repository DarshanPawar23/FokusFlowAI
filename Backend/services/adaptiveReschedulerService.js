import axios from "axios";

export const generateAdaptiveReschedule = async ({
  courseTitle,
  totalHours,
  originalDeadline,
  daysRemaining,
  completedVideos,
  remainingVideos,
  completedDays,
  missedDays,
  remainingHours,
  futureSchedule
}) => {
  try {

    // If impossible even after rescheduling
    const estimatedDailyHours = remainingHours / Math.max(daysRemaining, 1);

    if (estimatedDailyHours > 8) {
      return {
        possible: false,
        message: `The remaining ${remainingHours.toFixed(
          1
        )} study hours cannot be completed within ${daysRemaining} day(s).

Please extend your deadline.`
      };
    }

    const prompt = `
You are an AI Adaptive Study Mentor.

A student already has a study plan.

Some study days were completed.
Some were missed.

Your job is to update ONLY the remaining schedule.

========================

Course

${courseTitle}

Original Deadline

${originalDeadline} days

Completed Days

${completedDays}

Missed Days

${missedDays}

Completed Videos

${completedVideos}

Remaining Videos

${remainingVideos}

Remaining Hours

${remainingHours}

Days Remaining

${daysRemaining}

Current Future Schedule

${JSON.stringify(futureSchedule)}

========================

Return ONLY valid JSON.

{
  "possible": true,

  "summary": {
      "dailyHours": number,
      "completionDays": number
  },

  "schedule":[
    {
      "day": number,

      "goal":"",

      "videos":[
        "Video 1",
        "Video 2"
      ],

      "studyHours": number,

      "revisionMinutes":20,

      "priority":"Normal",

      "catchUp":false,

      "notes":""
    }
  ]
}

Rules

1. NEVER modify completed days.

2. ONLY regenerate remaining days.

3. Redistribute unfinished videos.

4. Increase study hours gradually.
Example:
2h
2.5h
2.75h
3h

5. Never exceed 8 hours/day.

6. Never put all missed work into one day.

7. Add catch-up days if necessary.

8. Keep revision every day.

9. Preserve module order.

10. Priority values:
Low
Normal
High

11. Mark catch-up days:
catchUp=true

12. Return ONLY JSON.
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        temperature: 0.2,
        max_tokens: 3500,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    let text = response.data.choices[0].message.content;

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("Invalid JSON returned by AI.");
    }

    return JSON.parse(text.substring(start, end + 1));

  } catch (error) {

    console.error("Adaptive Rescheduler Error:", error.message);

    return {
      possible: false,
      message: "Unable to generate updated study schedule."
    };
  }
};