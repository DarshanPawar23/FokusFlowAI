import db from "../db/db.js";

// Generate Unique Room Code
const generateRoomCode = async () => {
    let roomCode;
    let exists = true;

    while (exists) {

        roomCode = Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

        const [rows] = await db.execute(
            "SELECT id FROM study_rooms WHERE room_code = ?",
            [roomCode]
        );

        exists = rows.length > 0;
    }

    return roomCode;
};

// Get Active Room by Code
const getRoomByCode = async (roomCode) => {

    const [rooms] = await db.execute(
        "SELECT * FROM study_rooms WHERE room_code = ? AND status = 'active'",
        [roomCode]
    );

    return rooms[0];
};

// Get Current Member Count
const getMemberCount = async (roomId) => {

    const [rows] = await db.execute(
        "SELECT COUNT(*) AS total FROM room_members WHERE room_id = ?",
        [roomId]
    );

    return rows[0].total;
};

// Check Room Capacity
const isRoomFull = async (roomId) => {

    const total = await getMemberCount(roomId);

    return total >= 4;
};

// Check if User Already Joined
const isAlreadyJoined = async (roomId, userId) => {

    const [rows] = await db.execute(
        "SELECT id FROM room_members WHERE room_id = ? AND user_id = ?",
        [roomId, userId]
    );

    return rows.length > 0;
};

// Add Member
const addMember = async (roomId, userId) => {

    await db.execute(
        "INSERT INTO room_members (room_id, user_id) VALUES (?, ?)",
        [roomId, userId]
    );

};

// Remove Member
const removeMember = async (roomId, userId) => {

    await db.execute(
        "DELETE FROM room_members WHERE room_id = ? AND user_id = ?",
        [roomId, userId]
    );

};

export default {

    generateRoomCode,

    getRoomByCode,

    getMemberCount,

    isRoomFull,

    isAlreadyJoined,

    addMember,

    removeMember

};