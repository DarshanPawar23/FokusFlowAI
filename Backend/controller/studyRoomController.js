import db from "../db/db.js";
import roomService from "../services/roomService.js";

export const createRoom = async (req, res) => {
  try {
    const { playlistId } = req.body;
    const hostId = req.user.id;

    if (!playlistId) {
      return res.status(400).json({
        success: false,
        message: "Playlist ID is required.",
      });
    }

    // Verify playlist belongs to current user
    const [playlist] = await db.execute(
      `SELECT id
       FROM playlists
       WHERE id = ? AND user_id = ?`,
      [playlistId, hostId]
    );

    if (playlist.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found.",
      });
    }

    const roomCode = await roomService.generateRoomCode();

    const [roomResult] = await db.execute(
      `INSERT INTO study_rooms
        (room_code, playlist_id, host_user_id)
       VALUES (?, ?, ?)`,
      [roomCode, playlistId, hostId]
    );

    const roomId = roomResult.insertId;

    // Host automatically joins the room
    await roomService.addMember(roomId, hostId);

    return res.status(201).json({
      success: true,
      roomId,
      roomCode,
      playlistId,
      hostId,
      maxMembers: 4,
      currentMembers: 1,
    });

  } catch (err) {
    console.error("Create Room Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to create study room.",
    });
  }
};

export const joinRoom = async (req, res) => {
  try {
    const { roomCode, playlistId } = req.body;
    const userId = req.user.id;

    if (!roomCode) {
      return res.status(400).json({
        success: false,
        message: "Room code is required.",
      });
    }

    if (!playlistId) {
      return res.status(400).json({
        success: false,
        message: "Playlist ID is required.",
      });
    }

    // Find room
    const room = await roomService.getRoomByCode(roomCode);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found.",
      });
    }

    // Check if both users are studying the same course
    if (Number(room.playlist_id) !== Number(playlistId)) {
      return res.status(403).json({
        success: false,
        message:
          "You can only join a room for the same course you are currently studying.",
      });
    }

    // Already joined?
    const alreadyJoined = await roomService.isAlreadyJoined(
      room.id,
      userId
    );

    if (alreadyJoined) {
      return res.json({
        success: true,
        message: "Already joined.",
        roomId: room.id,
        roomCode: room.room_code,
        playlistId: room.playlist_id,
        hostId: room.host_user_id,
      });
    }

    // Room full?
    const full = await roomService.isRoomFull(room.id);

    if (full) {
      return res.status(400).json({
        success: false,
        message: "Room is full.",
      });
    }

    // Join room
    await roomService.addMember(room.id, userId);

    const members = await roomService.getMemberCount(room.id);

    return res.status(200).json({
      success: true,
      message: "Joined successfully.",
      roomId: room.id,
      roomCode: room.room_code,
      playlistId: room.playlist_id,
      hostId: room.host_user_id,
      members,
      maxMembers: room.max_members,
    });

  } catch (err) {
    console.error("Join Room Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to join room.",
    });
  }
};
export const leaveRoom = async (req, res) => {
    try {

        const { roomCode } = req.body;
        const userId = req.user.id;

        if (!roomCode) {
            return res.status(400).json({
                success: false,
                message: "Room code is required."
            });
        }

        const room = await roomService.getRoomByCode(roomCode);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found."
            });
        }

        await roomService.removeMember(room.id, userId);

        const members = await roomService.getMemberCount(room.id);

        return res.json({
            success: true,
            message: "Left room successfully.",
            members
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};
export const closeRoom = async (req, res) => {

    try {

        const { roomCode } = req.params;
        const userId = req.user.id;

        const room = await roomService.getRoomByCode(roomCode);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found."
            });
        }

        if (room.host_user_id !== userId) {
            return res.status(403).json({
                success: false,
                message: "Only host can close the room."
            });
        }

        await db.execute(
            "UPDATE study_rooms SET status='closed' WHERE id=?",
            [room.id]
        );

        return res.json({
            success: true,
            message: "Room closed successfully."
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};
export const getRoomDetails = async (req, res) => {

    try {

        const { roomCode } = req.params;

        const room = await roomService.getRoomByCode(roomCode);

        if (!room) {

            return res.status(404).json({
                success: false,
                message: "Room not found."
            });

        }

        const [members] = await db.execute(

            `SELECT
                rm.user_id,
                u.email
             FROM room_members rm
             JOIN users u
             ON rm.user_id=u.id
             WHERE rm.room_id=?`,

            [room.id]

        );

        return res.json({

            success: true,

            room: {

                id: room.id,

                roomCode: room.room_code,

                playlistId: room.playlist_id,

                hostId: room.host_user_id,

                status: room.status,

                maxMembers: room.max_members,

                currentMembers: members.length,

                members

            }

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};
export const getRoomMessages = async (req, res) => {

    try {

        const { roomCode } = req.params;

        const room = await roomService.getRoomByCode(roomCode);

        if (!room) {

            return res.status(404).json({
                success: false,
                message: "Room not found."
            });

        }

        const [messages] = await db.execute(

            `SELECT
                rm.id,
                rm.user_id,
                u.email,
                rm.message,
                rm.created_at
             FROM room_messages rm
             JOIN users u
             ON rm.user_id=u.id
             WHERE rm.room_id=?
             ORDER BY rm.created_at ASC`,

            [room.id]

        );

        return res.json({

            success: true,

            messages

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};