import { useEffect, useState } from "react";
import { getPlayers } from "../services/api";
import PlayerCard from "../components/players/PlayerCard";

export default function Home() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    getPlayers().then(setPlayers);
  }, []);

  return (
    <div className="container">
      <h1>Available Players</h1>
      <div className="grid">
        {players.map((p) => (
          <PlayerCard key={p._id} player={p} />
        ))}
      </div>
    </div>
  );
}
