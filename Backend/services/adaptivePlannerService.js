import axios from "axios";

export const generateAdaptiveStudyPlan = async ({
  courseTitle,
  totalVideos,
  totalHours,
  targetDays,
  structuredCourse
}) => {
  try {

    const context = structuredCourse.map(section => ({
      section: section.sectionTitle,
      topics: section.videos.map(video => video.title)
    }));

    const dailyHours = totalHours / targetDays;

    // Reject impossible schedules
    if (dailyHours > 8) {
      return {
        possible: false,
        message: `Completing this course in ${targetDays} days requires ${dailyHours.toFixed(
          1
        )} study hours/day.

Please increase your deadline.`
      };
    }

    const prompt = `
You are an AI Adaptive Study Mentor.

Generate a professional study schedule.

Course

${courseTitle}

Total Videos

${totalVideos}

Estimated Hours

${totalHours}

Deadline

${targetDays} days

Course Structure

${JSON.stringify(context)}

========================

Return ONLY valid JSON.

{
  "possible": true,

  "summary": {
      "dailyHours": number,
      "dailyVideos": number,
      "completionDays": number
  },

  "schedule":[

    {
      "day":1,

      "goal":"Module Name",

      "videos":[
          "Video 1",
          "Video 2"
      ],

      "studyHours":2.5,

      "revisionMinutes":20,

      "priority":"Normal",

      "catchUp":false,

      "notes":""
    }

  ]
}

Rules

1. Follow module order.

2. Never exceed 8 study hours/day.

3. Balance workload equally.

4. Split large modules.

5. Add revision every day.

6. Include every video exactly once.

7. Never skip modules.

8. Keep total hours close to estimated hours.

9. Priority values:
Low
Normal
High

10. CatchUp must initially be false.

11. Return ONLY JSON.
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
      throw new Error("AI returned invalid JSON.");
    }

    const plan = JSON.parse(text.substring(start, end + 1));

    return plan;

  } catch (error) {

    console.error("Adaptive Planner Error:", error.message);

    return {
      possible: false,
      message: "Unable to generate study plan."
    };
  }
};