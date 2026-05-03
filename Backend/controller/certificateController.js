import db from "../db/db.js"
import { generateCertificatePDF } from "../services/certificateService.js";
import { sendCertificateMail } from "../services/mailService.js";
import crypto from "crypto";

export const generateCertificate = async (req, res) => {
    try {
        const userId = req.user.id;
        const { playlistId, fullName } = req.body;

        if (!playlistId || !fullName) {
            return res.status(400).json({
                success: false,
                message: "Missing data"
            });
        }
        const [[progress]] = await db.query(
            "SELECT percentage FROM exam_attempts WHERE user_id = ? AND playlist_id = ?",
            [userId, playlistId]
        );
        if (!progress || progress.percentage < 60) {
            return res.status(400).json({
                success: false,
                message: "Pass exam first"
            });
        }
        const [existing] = await db.query(
            "SELECT id FROM certificates WHERE user_id = ? AND playlist_id = ?",
            [userId, playlistId]
        );

        if (existing.length > 0) {
            return res.json({
                success: true,
                message: "Certificate already sent"
            });
        }
        const [[user]] = await db.query(
            "SELECT email FROM users WHERE id = ?",
            [userId]
        );

        const [[course]] = await db.query(
            "SELECT structured_data FROM playlists WHERE id = ?",
            [playlistId]
        );

        const parsed =
            typeof course.structured_data === "string"
                ? JSON.parse(course.structured_data)
                : course.structured_data;
        const courseName = parsed[0]?.sectionTitle || "Course";

        const certificateId = crypto.randomBytes(6).toString("hex");

        const filePath = await generateCertificatePDF({
            fullName,
            courseName,
            certificateId
        });
        await sendCertificateMail(user.email, filePath);
        await db.query(
            "INSERT INTO certificates (user_id, playlist_id, full_name, certificate_url) VALUES (?, ?, ?, ?)",
            [userId, playlistId, fullName, filePath]
        );
        res.json({
            success: true,
            message: "Certificate sent to email"
        });
    }
    catch (error) {
        console.error("CERT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
}