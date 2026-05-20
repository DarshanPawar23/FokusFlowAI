import axios from "axios";

export const generateRecommendedQuestions = async ({ transcript, videoTitle }) => {
  try {
    const prompt = `
You are an expert YouTube learning assistant.

STRICT RULES:
- Generate questions ONLY from the given video topic
- DO NOT change domain (if video is about YouTube, do NOT ask programming)
- DO NOT introduce new topics
- Questions must be practical and directly related to THIS video
- Keep them beginner-friendly

VIDEO TITLE:
${videoTitle}

VIDEO CONTEXT:
${transcript}

Return ONLY JSON:
{
  "questions": [
    "question1",
    "question2",
    "question3",
    "question4",
    "question5"
  ]
}
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return JSON.parse(response.data.choices[0].message.content);

  } catch (err) {
    console.error("Recommended Questions Error:", err.message);
    throw new Error("Failed to generate questions");
  }
};