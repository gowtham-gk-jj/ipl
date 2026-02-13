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
const dashboardRoutes = require("./routes/dashboardRoutes");

const initSocket = require("./socket");

/* ================= DB CONNECT ================= */
connectDB();

/* ================= APP INIT ================= */
const app = express();

/* ================= CORS ================= */
app.use(
  cors({
    origin: "*", // Later restrict to frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

/* ================= ROOT ROUTE (Fix Cannot GET /) ================= */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "IPL Auction Backend Running 🚀",
  });
});

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/auction", auctionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/uploads", express.static("uploads"));


/* ================= SOCKET ================= */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initSocket(io);

/* ================= SERVER START ================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
