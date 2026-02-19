import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("Socket Connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Socket Connection Error:", err.message);
});

export default socket;
