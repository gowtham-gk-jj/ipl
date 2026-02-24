const Team = require("./models/Team"); // 🔥 IMPORT TEAM MODEL

let currentAuction = {
  player: null,
  highestBid: 0,
  highestBidder: null,
  status: "IDLE",
  teams: [], // 🔥 ADD TEAMS
};

const initSocket = (io) => {
  io.on("connection", async (socket) => {
    console.log("✅ User Connected:", socket.id);

    // 🔥 Always refresh teams when user connects
    currentAuction.teams = await Team.find();

    socket.emit("auctionState", currentAuction);

    /* ===== START AUCTION ===== */
    socket.on("startAuction", async (player) => {
      if (!player) return;

      currentAuction = {
        player,
        highestBid: player.basePrice || 0,
        highestBidder: null,
        status: "LIVE",
        teams: await Team.find(), // 🔥 INCLUDE TEAMS
      };

      io.emit("auctionState", currentAuction);
      console.log("🔥 Auction Started:", player.name);
    });

    /* ===== PLACE BID ===== */
    socket.on("placeBid", ({ amount }) => {
      if (!currentAuction.player) {
        socket.emit("bidError", "No active auction");
        return;
      }

      if (!amount || amount <= currentAuction.highestBid) {
        socket.emit("bidError", "Bid must be higher than current bid");
        return;
      }

      currentAuction.highestBid = amount;

      io.emit("auctionState", currentAuction);
      console.log("💰 New Bid:", amount);
    });

    /* ===== SOLD ===== */
    socket.on("playerSold", async ({ teamName }) => {
      if (!currentAuction.player) return;

      currentAuction.status = "SOLD";
      currentAuction.highestBidder = teamName || "Unknown";

      // 🔥 REFRESH TEAMS AFTER SOLD
      currentAuction.teams = await Team.find();

      io.emit("auctionState", currentAuction);
      console.log("🏆 Player Sold to:", teamName);
    });

    /* ===== UNSOLD ===== */
    socket.on("playerUnsold", async () => {
      if (!currentAuction.player) return;

      currentAuction.status = "UNSOLD";

      currentAuction.teams = await Team.find(); // 🔥 REFRESH

      io.emit("auctionState", currentAuction);
      console.log("❌ Player Unsold");
    });

    /* ===== END AUCTION ===== */
    socket.on("endAuction", async () => {
      currentAuction = {
        player: null,
        highestBid: 0,
        highestBidder: null,
        status: "IDLE",
        teams: await Team.find(), // 🔥 INCLUDE TEAMS
      };

      io.emit("auctionState", currentAuction);
      console.log("🏁 Auction Reset");
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ User Disconnected:", socket.id, reason);
    });
  });
};

module.exports = initSocket;