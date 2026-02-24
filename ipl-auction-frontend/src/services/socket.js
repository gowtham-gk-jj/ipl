import { io } from "socket.io-client";

/* ================= SOCKET INSTANCE ================= */

const socket = io("https://ipl-c9o8.onrender.com", {
  autoConnect: false,              // Prevent auto connection (important)
  transports: ["websocket", "polling"], // Works better on Render
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
  timeout: 30000,
  forceNew: true,
});

/* ================= CONNECTION EVENTS ================= */

socket.on("connect", () => {
  console.log("✅ Socket Connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("⚠️ Socket Disconnected:", reason);
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket Connection Error:", err.message);
});

/* ================= EXPORT ================= */

export default socket;