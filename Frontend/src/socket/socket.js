import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,

  auth: {
    token: localStorage.getItem("token"),
    userId: Number(localStorage.getItem("userId")),
    email: localStorage.getItem("email"),
  },

  transports: ["websocket", "polling"],
});

socket.on("connect", () => {
  console.log("Socket Connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log(" Socket Disconnected:", reason);
});

socket.on("connect_error", (err) => {
  console.error("Socket Error:", err.message);
});