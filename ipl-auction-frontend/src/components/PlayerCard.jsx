function PlayerCard({ player }) {
  return (
    <div className="card">
      <h3>{player.name}</h3>
      <p>Matches: {player.matches}</p>
      <p>Runs: {player.runs}</p>
      <p>Country: {player.country}</p>
      <p>Base Price: ₹{player.basePrice}</p>
    </div>
  );
}

export default PlayerCard;
