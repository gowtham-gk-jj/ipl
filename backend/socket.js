let currentAuction = {
  player: null,
  highestBid: 0,
  highestBidder: null,
  status: "IDLE", // IDLE | LIVE | SOLD | UNSOLD
};

const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ User Connected:", socket.id);

    /* ===== SEND CURRENT STATE TO NEW USER ===== */
    socket.emit("auctionState", currentAuction);

    /* ===== START AUCTION ===== */
    socket.on("startAuction", (player) => {
      if (!player) return;

      currentAuction = {
        player,
        highestBid: player.basePrice || 0,
        highestBidder: null,
        status: "LIVE",
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
    socket.on("playerSold", ({ teamName }) => {
      if (!currentAuction.player) return;

      currentAuction.status = "SOLD";
      currentAuction.highestBidder = teamName || "Unknown";

      io.emit("auctionState", currentAuction);
      console.log("🏆 Player Sold to:", teamName);
    });

    /* ===== UNSOLD ===== */
    socket.on("playerUnsold", () => {
      if (!currentAuction.player) return;

      currentAuction.status = "UNSOLD";

      io.emit("auctionState", currentAuction);
      console.log("❌ Player Unsold");
    });

    /* ===== END AUCTION ===== */
    socket.on("endAuction", () => {
      currentAuction = {
        player: null,
        highestBid: 0,
        highestBidder: null,
        status: "IDLE",
      };

      io.emit("auctionState", currentAuction);
      console.log("🏁 Auction Reset");
    });

    /* ===== DISCONNECT ===== */
    socket.on("disconnect", (reason) => {
      console.log("❌ User Disconnected:", socket.id, reason);
    });
  });
};

module.exports = initSocket;