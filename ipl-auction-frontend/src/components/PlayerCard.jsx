export default function PlayerCard({ player }) {
  return (
    <div className="bg-white shadow rounded p-4">
      <img
        src={player.image}
        alt={player.name}
        className="w-full h-48 object-cover rounded"
      />
      <h3 className="font-bold mt-2">{player.name}</h3>
      <p>{player.category}</p>
      <p className="text-green-600 font-bold">₹ {player.price}</p>
    </div>
  );
}
