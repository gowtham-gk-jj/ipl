import TeamNavbar from "../components/TeamNavbar";

export default function TeamDashboard() {
  const team = {
    name: "Chennai Super Kings",
    purse: 50000000,
    spent: 20000000,
    players: 5
  };

  return (
    <>
      <TeamNavbar />
      <div className="p-6 grid md:grid-cols-3 gap-6">
        <div className="bg-white shadow p-6 rounded">
          <h2 className="font-bold text-lg">Team Name</h2>
          <p>{team.name}</p>
        </div>

        <div className="bg-white shadow p-6 rounded">
          <h2 className="font-bold text-lg">Remaining Purse</h2>
          <p>₹ {team.purse - team.spent}</p>
        </div>

        <div className="bg-white shadow p-6 rounded">
          <h2 className="font-bold text-lg">Players Bought</h2>
          <p>{team.players}</p>
        </div>
      </div>
    </>
  );
}
