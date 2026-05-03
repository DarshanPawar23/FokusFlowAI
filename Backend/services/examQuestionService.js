import axios from "axios";

const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const generateExamQuestions = async (courseTitle, structuredCourse) => {
  try {
    const context = structuredCourse.map(section => ({
      section: section.sectionTitle,
      topics: section.videos.map(v => v.title)
    }));

    const prompt = `
You are a senior technical interviewer.

Generate EXACTLY 20 high-quality MCQ questions.

STRICT RULES:
- RETURN ONLY VALID JSON ARRAY
- NO explanation
- NO markdown
- EACH question MUST have 4 options
- Options must be meaningful (not empty)
- Only ONE correct answer

FORMAT:
[
  {
    "question": "string",
    "options": ["option1", "option2", "option3", "option4"],
    "correctIndex": 0
  }
]

IMPORTANT:
- Questions must test understanding (not basic definitions)
- Use topics provided
- Mix difficulty (easy, medium, hard)

Course: ${courseTitle}

Content:
${JSON.stringify(context)}
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 2200
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    let text = response.data.choices[0].message.content;

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");

    if (start === -1 || end === -1) {
      throw new Error("Invalid JSON from AI");
    }

    let parsed = JSON.parse(text.substring(start, end + 1));

    parsed = parsed.map((q, i) => {
      if (!q.options || q.options.length !== 4) {
        return {
          question: q.question || `Question ${i + 1}`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctIndex: 0
        };
      }
      return q;
    });

    return parsed;

  } catch (error) {
    console.error(" Exam Error:", error.message);

    return Array.from({ length: 20 }).map((_, i) => ({
      question: `Sample Question ${i + 1}`,
      options: [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      correctIndex: 0
    }));
  }
};