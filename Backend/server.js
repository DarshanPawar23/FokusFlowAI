import express from "express";
import http from "http"; // Required for Socket.io integration
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import router from "./routes/certificateRoutes.js";
import router2 from "./routes/studyRoutes.js";
import router3 from "./routes/studyRoomRoutes.js"; 
import { initSocket } from "./socket/socketServer.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);

initSocket(server);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://fokus-flow-ai.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Application Routing Base layers
app.use("/api/users", userRoutes);
app.use("/api/users", router2);
app.use("/api/certificate", router);
app.use("/api/study-room", router3);

app.get("/", (req, res) => {
  res.send("Server running with active Socket engine.");
});

app.get("/list-models", async (req, res) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
  );
  const data = await response.json();
  res.json(data);
});

app.get("/test-search", async (req, res) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CSE_ID}&q=Binary+Search+Tree+notes`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

server.listen(port, () => {
  console.log(`🚀 FokusFlow Backend connected at port ${port}`);
});