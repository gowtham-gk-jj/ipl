import { io } from "socket.io-client";

/* ================= SOCKET INSTANCE ================= */

const socket = io("https://ipl-c9o8.onrender.com", {
  autoConnect: false,                // manual connect
  transports: ["polling", "websocket"], // ✅ polling FIRST (important)
  reconnection: true,
  reconnectionAttempts: 15,
  reconnectionDelay: 2000,
  timeout: 45000,                    // give Render time to wake
});

/* ================= CONNECTION EVENTS ================= */

socket.on("connect", () => {
  console.log("✅ Socket Connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("⚠️ Socket Disconnected:", reason);
});

socket.on("connect_error", (err) => {
  console.log("❌ Socket Error:", err.message);
});

export default socket;