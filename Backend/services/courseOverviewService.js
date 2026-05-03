import axios from "axios";

export const generateOverview = async (structuredData, totalMinutes) => {
  try {
    const prompt = `
You are a professional course curriculum strategist.

Generate a professional course overview.

STRICT RULES:
- Return ONLY valid JSON.
- No markdown.
- No explanation text.

Return format:

{
  "courseTitle": "string",
  "level": "Beginner/Intermediate/Advanced",
  "totalHours": number,
  "totalSections": number,
  "totalLectures": number,
  "shortDescription": "2-3 lines",
  "skillsCovered": ["skill1", "skill2"],
  "whatYouWillLearn": ["point1", "point2"],
  "targetAudience": "string"
}

Course Structure:
${JSON.stringify(structuredData)}

Total Duration (minutes):
${totalMinutes}
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.3
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

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("Invalid JSON from AI");
    }

    const jsonString = text.substring(start, end + 1);

    return JSON.parse(jsonString);

  } catch (error) {
    console.error("Groq Overview Error:", error.response?.data || error.message);
    throw new Error("Overview generation failed");
  }
};