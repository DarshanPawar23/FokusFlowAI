import { Server } from "socket.io";

export function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://fokus-flow-ai.vercel.app",
      ],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`⚡ Connected: ${socket.id}`);

    // Join Room Room Handling
    socket.on("join-room", ({ roomCode, userId, username }) => {
      socket.join(roomCode);
      console.log(`👤 User ${username || userId} joined room: ${roomCode}`);
      
      // Notify other room members
      socket.to(roomCode).emit("user-joined", { userId, username });
    });

    // 🔄 Sync Playback Controls
   socket.on("play", ({ roomCode }) => {
  socket.to(roomCode).emit("play");
});

socket.on("pause", ({ roomCode }) => {
  socket.to(roomCode).emit("pause");
});

socket.on("seek", ({ roomCode, time }) => {
  socket.to(roomCode).emit("seek", { time });
});

socket.on("change-video", ({ roomCode, videoId }) => {
  socket.to(roomCode).emit("change-video", {
    videoId,
  });
  });

    // 💬 Real-Time Group Chat
    socket.on("chat-message", (data) => {
      // Broadcasts message to everyone in the room, including sender
      io.to(data.roomCode).emit("new-message", data);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Disconnected: ${socket.id}`);
    });
  });

  return io;
}