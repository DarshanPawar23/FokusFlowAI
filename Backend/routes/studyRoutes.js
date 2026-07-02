import express from "express";
import { createStudyPlan, reschedulePlan ,getStudyPlan} from "../controller/studyPlanController.js";
import { protect } from "../middleware/authMiddleware.js";

const router2 = express.Router();

router2.post("/creaty", protect, createStudyPlan);

router2.patch("/reschedule/:planId", protect, reschedulePlan);

router2.get("/:playlistId", protect, getStudyPlan);

export default router2;