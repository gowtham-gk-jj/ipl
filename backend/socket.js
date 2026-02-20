let currentAuction = {
  player: null,
  highestBid: 0,
  highestBidder: null,
};

const initSocket = (io) => {

  io.on("connection", (socket) => {
    console.log("✅ User Connected:", socket.id);

    // 🔥 FIX: Send current auction state to newly connected user
    if (currentAuction.player) {
      socket.emit("auctionPlayer", currentAuction);
    }

    /* ================= JOIN TEAM ROOM ================= */
    socket.on("joinTeamRoom", (teamId) => {
      if (!teamId) return;
      socket.join(teamId);
      console.log("Joined Team Room:", teamId);
    });

    /* ================= START AUCTION ================= */
    socket.on("startAuction", (player) => {
      if (!player) return;

      currentAuction = {
        player,
        highestBid: player.basePrice || 0,
        highestBidder: null,
      };

      io.emit("auctionPlayer", currentAuction);
      console.log("🔥 Auction Started:", player.name);
    });

    /* ================= PLACE BID ================= */
    socket.on("placeBid", ({ teamId, amount }) => {

      if (!currentAuction.player) {
        socket.emit("bidError", "No active auction");
        return;
      }

      if (!amount || amount <= currentAuction.highestBid) {
        socket.emit("bidError", "Bid must be higher than current bid");
        return;
      }

      currentAuction.highestBid = amount;
      currentAuction.highestBidder = teamId;

      io.emit("bidUpdate", {
        playerId: currentAuction.player._id,
        highestBid: currentAuction.highestBid,
        highestBidder: currentAuction.highestBidder,
      });

      console.log("💰 New Bid:", amount, "by", teamId);
    });

    /* ================= END AUCTION ================= */
    socket.on("endAuction", () => {

      if (!currentAuction.player) {
        socket.emit("auctionError", "No active auction to end");
        return;
      }

      io.emit("auctionEnded", currentAuction);

      console.log("🏁 Auction Ended for:", currentAuction.player.name);

      currentAuction = {
        player: null,
        highestBid: 0,
        highestBidder: null,
      };
    });

    /* ================= DISCONNECT ================= */
    socket.on("disconnect", () => {
      console.log("❌ User Disconnected:", socket.id);
    });

  });

};

module.exports = initSocket;