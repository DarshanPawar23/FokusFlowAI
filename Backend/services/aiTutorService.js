import axios from "axios";

export const generateAITutorResponse = async ({ question, transcript, videoTitle }) => {
  try {
    const prompt = `
      VIDEO TITLE: ${videoTitle}
      VIDEO TRANSCRIPT / CONTEXT: ${transcript}
      STUDENT QUESTION: ${question || "Explain what is happening in this video"}
    `;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant", // Using a higher-tier model for better JSON logic
        messages: [
          {
            role: "system",
            content: `You are an elite AI Tutor. You explain concepts step-by-step for beginners.
            You must respond ONLY with a valid JSON object. 
            Do not include markdown formatting or extra text.
            
            Format:
            {
              "explanation": "Detailed teacher-like explanation",
              "keyPoints": ["point1", "point2", "point3"],
              "followUpQuestions": ["Q1", "Q2"],
              "mcqs": [
                {
                  "question": "Question?",
                  "options": ["A", "B", "C", "D"],
                  "correctIndex": 0
                }
              ]
            }`
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.3, // Lower temperature = more stable JSON
        response_format: { type: "json_object" } // Groq supports JSON mode
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const rawContent = response.data.choices[0].message.content;

    try {
      // If response_format: json_object is used, it should be clean JSON
      return JSON.parse(rawContent);
    } catch (parseErr) {
      // Fallback: Extract JSON using Regex if there's markdown fluff
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error("AI output could not be parsed as JSON");
    }
  } catch (err) {
    console.error("AI TUTOR ERROR:", err.response?.data || err.message);
    throw new Error(err.response?.data?.error?.message || "Failed to get AI response");
  }
};