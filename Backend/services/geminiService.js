import axios from "axios";

export const generateStructure = async (videoData) => {
  try {
    const limitedVideos = videoData.slice(0, 30); // keep small = stable

    const prompt = `
You are a senior curriculum architect (Udemy level).

Convert these videos into a PROFESSIONAL course structure.

STRICT:
- ONLY JSON
- No markdown
- No explanation
- No "Course Content", "Module 1"
- Use real topic-based section names

RULES:
- Minimum 4 sections
- Each section 3–8 videos
- Maintain order
- Group logically (beginner → advanced)

GOOD EXAMPLES:
- Introduction & Setup
- Basics of C++ Syntax
- Control Flow & Logic
- Functions & Modular Programming
- Memory & Pointers
- Practice & Projects

FORMAT:
[
  {
    "sectionTitle": "string",
    "videos": [
      {
        "title": "string",
        "videoId": "string",
        "status": "playing or upcoming"
      }
    ]
  }
]

Videos:
${JSON.stringify(limitedVideos)}
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 1800
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

    let first = false;
    parsed.forEach(section => {
      section.videos = section.videos.map(v => {
        if (!first) {
          first = true;
          return { ...v, status: "playing" };
        }
        return { ...v, status: "upcoming" };
      });
    });

    const seen = new Set();
    parsed = parsed.map((s, i) => {
      let title = s.sectionTitle?.trim() || `Topic ${i + 1}`;
      if (seen.has(title)) title += ` ${i + 1}`;
      seen.add(title);
      return { ...s, sectionTitle: title };
    });

    return parsed;

  } catch (error) {
    console.error("Structure Error:", error.message);

    return [
      {
        sectionTitle: "Introduction & Setup",
        videos: videoData.slice(0, 5).map((v, i) => ({
          title: v.title,
          videoId: v.videoId,
          status: i === 0 ? "playing" : "upcoming"
        }))
      },
      {
        sectionTitle: "Core Concepts",
        videos: videoData.slice(5, 15).map(v => ({
          title: v.title,
          videoId: v.videoId,
          status: "upcoming"
        }))
      },
      {
        sectionTitle: "Intermediate Topics",
        videos: videoData.slice(15, 25).map(v => ({
          title: v.title,
          videoId: v.videoId,
          status: "upcoming"
        }))
      },
      {
        sectionTitle: "Advanced & Practice",
        videos: videoData.slice(25, 35).map(v => ({
          title: v.title,
          videoId: v.videoId,
          status: "upcoming"
        }))
      }
    ];
  }
};