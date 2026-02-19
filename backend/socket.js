const initSocket = (io) => {

  io.on("connection", (socket) => {

    console.log("User Connected:", socket.id);

    /* ================= JOIN TEAM ROOM ================= */
    socket.on("joinTeamRoom", (teamId) => {
      socket.join(teamId);
      console.log("Joined Team Room:", teamId);
    });

    /* ================= START AUCTION ================= */
    socket.on("startAuction", (player) => {
      io.emit("auctionPlayer", player);
    });

    /* ================= BID UPDATE ================= */
    socket.on("placeBid", ({ playerId, amount }) => {
      io.emit("bidUpdate", {
        playerId,
        amount,
      });
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);
    });

  });
};

module.exports = initSocket;
