import { io } from "socket.io-client";

const socket = io("https://ipl-c9o8.onrender.com", {
  transports: ["websocket", "polling"],
  autoConnect: true,
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Socket Connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Socket Connection Error:", err.message);
});

export default socket;
