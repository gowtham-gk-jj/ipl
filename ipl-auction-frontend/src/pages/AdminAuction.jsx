import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function AdminAuction() {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/players")
      .then(res => setPlayers(res.data));
  }, []);

  const startAuction = (player) => {
    setSelectedPlayer(player);
  };

  return (
    <div className="container">
      <h1>Host Auction Panel</h1>

      <h2>Players</h2>
      {players.map(player => (
        <div key={player._id}>
          {player.name}
          <button onClick={() => startAuction(player)}>Start Auction</button>
        </div>
      ))}

      {selectedPlayer && (
        <div>
          <h2>Live Auction: {selectedPlayer.name}</h2>
          <p>Base Price: ₹{selectedPlayer.basePrice}</p>
        </div>
      )}
    </div>
  );
}

export default AdminAuction;
