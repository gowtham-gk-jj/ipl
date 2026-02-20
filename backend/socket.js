let currentAuction = {
  player: null,
  highestBid: 0,
};

const initSocket = (io) => {

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    if (currentAuction.player) {
      socket.emit("auctionPlayer", currentAuction);
    }

    socket.on("startAuction", (player) => {

      currentAuction = {
        player,
        highestBid: player.basePrice || 0,
      };

      io.emit("auctionPlayer", currentAuction);
    });

    socket.on("placeBid", ({ amount }) => {

      if (!currentAuction.player) return;

      if (!amount || amount <= currentAuction.highestBid) {
        socket.emit("bidError", "Invalid bid");
        return;
      }

      currentAuction.highestBid = amount;

      io.emit("bidUpdate", {
        highestBid: amount,
      });

      console.log("New Bid:", amount);
    });

    socket.on("playerSold", (data) => {
      io.emit("playerSold", data);
      currentAuction = { player: null, highestBid: 0 };
    });

    socket.on("playerUnsold", () => {
      io.emit("playerUnsold");
      currentAuction = { player: null, highestBid: 0 };
    });

  });

};

module.exports = initSocket;