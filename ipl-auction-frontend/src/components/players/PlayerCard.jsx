export default function PlayerCard({ player }) {
  return (
    <div className="border p-4 rounded shadow">
      <img src={player.image} alt={player.name} className="h-40 w-full object-cover" />
      <h3 className="font-bold">{player.name}</h3>
      <p>{player.category}</p>
      <p>₹ {player.basePrice}</p>
    </div>
  );
}
