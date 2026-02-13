export default function TeamCard({ team }) {
  return (
    <div className="border p-4">
      <h3>{team.name}</h3>
      <p>Budget: ₹ {team.budget}</p>
    </div>
  );
}
