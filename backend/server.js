require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const teamRoutes = require("./routes/teamRoutes");
const playerRoutes = require("./routes/playerRoutes");
const auctionRoutes = require("./routes/auctionRoutes");

const initSocket = require("./socket");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/auction", auctionRoutes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

initSocket(io);

server.listen(process.env.PORT || 5000, () =>
  console.log("Server running")
);
