import { useEffect, useState } from "react";
import {
  getTeams,
  createTeam,
  updateTeam,
  deleteTeam
} from "../services/teamService";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({
    name: "",
    budget: ""
  });

  const loadTeams = async () => {
    const data = await getTeams();
    setTeams(data);
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const handleCreate = async () => {
    await createTeam({
      name: form.name,
      budget: Number(form.budget),
      remainingPurse: Number(form.budget),
      playerCount: 0
    });

    setForm({ name: "", budget: "" });
    loadTeams();
  };

  const handleUpdate = async (team) => {
    await updateTeam(team._id, team);
    loadTeams();
  };

  const handleDelete = async (id) => {
    await deleteTeam(id);
    loadTeams();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Team Management</h1>

      <div className="mb-6">
        <input
          placeholder="Team Name"
          className="border p-2 mr-2"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Budget"
          className="border p-2 mr-2"
          value={form.budget}
          onChange={(e) =>
            setForm({ ...form, budget: e.target.value })
          }
        />

        <button
          onClick={handleCreate}
          className="bg-green-500 text-white px-4 py-2"
        >
          Create Team
        </button>
      </div>

      {teams.map((team) => (
        <div
          key={team._id}
          className="border p-4 mb-3 flex justify-between"
        >
          <div>
            <h3 className="font-bold">{team.name}</h3>
            <p>Total Budget: ₹{team.budget}</p>
            <p>Remaining Purse: ₹{team.remainingPurse}</p>
            <p>Player Count: {team.playerCount}</p>
          </div>

          <button
            onClick={() => handleDelete(team._id)}
            className="bg-red-500 text-white px-3"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
