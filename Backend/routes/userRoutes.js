import express from "express";
import { registerUser, loginUser ,addPlaylist,getCurrentCourse,addNote,getNotes,createExam,submitExam,getExamQuestions,getUserProgress,deletePlaylist,getAllCourses,getRecommendedQuestions} from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { askAITutor } from "../controller/userController.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.post("/add-playlist", protect, addPlaylist);
userRoutes.get("/current-course", protect, getCurrentCourse);

userRoutes.post("/add-Note",protect,addNote);
userRoutes.get("/get-Notes",protect,getNotes);

userRoutes.post("/create-exam", protect, createExam);
userRoutes.post("/submit-exam", protect, submitExam);
userRoutes.get("/get-exam-questions/:examId", protect, getExamQuestions);

userRoutes.post("/ask", protect, askAITutor);
userRoutes.get("/progress", protect, getUserProgress);
userRoutes.delete("/delete-playlist/:playlistId", protect, deletePlaylist);
userRoutes.get("/all-courses", protect, getAllCourses);
userRoutes.post("/recommended-questions", protect, getRecommendedQuestions);

export default userRoutes;
