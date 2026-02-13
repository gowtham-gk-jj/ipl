const Player = require("./models/Player");
const Team = require("./models/Team");
const Bid = require("./models/Bid");

const initSocket = (io) => {
  io.on("connection", (socket) => {

    socket.on("placeBid", async ({ playerId, teamId, amount }) => {

      const player = await Player.findById(playerId);
      const team = await Team.findById(teamId);

      if (!player || player.isSold) return;
      if (team.remainingPurse < amount) return;

      player.soldPrice = amount;
      player.soldTo = teamId;
      await player.save();

      await Bid.create({ player: playerId, team: teamId, amount });

      io.emit("bidUpdated", player);
    });

  });
};

module.exports = initSocket;
