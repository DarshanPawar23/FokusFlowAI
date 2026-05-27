import express from "express"
import cors from "cors";
import userRoutes from "./routes/userRoutes.js"
import router from "./routes/certificateRoutes.js"
import dotenv from "dotenv";
dotenv.config();

const app = express();
let port = 3000;

app.use(
  cors({
    origin: "https://fokus-flow-ai.vercel.app/",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/certificate", router);

app.get("/", (req, res) => {
    res.send("Server is running ");
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

app.listen(port, () => {
    console.log(`connected at the ${port}`);
})