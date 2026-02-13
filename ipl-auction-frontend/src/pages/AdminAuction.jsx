import { useEffect, useState } from "react";
import { getPlayers } from "../services/api";

export default function AdminAuction() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    getPlayers().then(setPlayers);
  }, []);

  return (
    <div className="container">
      <h1>Admin Auction Panel</h1>
      {players.map((p) => (
        <div key={p._id}>
          {p.name} - ₹{p.currentPrice}
        </div>
      ))}
    </div>
  );
}
