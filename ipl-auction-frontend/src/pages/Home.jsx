import PlayerCard from "../components/PlayerCard";
import batsmanData from "../data/batsmanData";

function Home() {
  return (
    <div className="container">
      <h1>Batsman Category</h1>
      <div className="grid">
        {batsmanData.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
}

export default Home;
