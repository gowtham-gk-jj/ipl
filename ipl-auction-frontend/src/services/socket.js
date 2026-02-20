import { io } from "socket.io-client";

const socket = io("https://ipl-c9o8.onrender.com", {
  transports: ["polling", "websocket"], // polling first (important for Render)
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
  timeout: 20000, // 20 sec for Render cold start
});

socket.on("connect", () => {
  console.log("✅ Socket Connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("⚠️ Socket Disconnected");
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket Connection Error:", err.message);
});

export default socket;