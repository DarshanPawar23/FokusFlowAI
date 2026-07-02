import express from "express";
import {
    createRoom,
    joinRoom,
    leaveRoom,
    closeRoom,
    getRoomDetails,
    getRoomMessages
} from "../controller/studyRoomController.js";

import { protect } from "../middleware/authMiddleware.js";

const router3 = express.Router();

router3.post("/create", protect, createRoom);
router3.post("/join", protect, joinRoom);
router3.post("/leave", protect, leaveRoom);

router3.delete("/close/:roomCode", protect, closeRoom);

router3.get("/messages/:roomCode", protect, getRoomMessages);
router3.get("/:roomCode", protect, getRoomDetails);

export default router3;