import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { getTeams, createTeam, updateTeam, deleteTeam } from "../../services/teamService";

export default function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({ name: "", budget: "" });
  const [editId, setEditId] = useState(null);

  const load = async () => {
    const data = await getTeams();
    setTeams(data);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    if (editId) {
      await updateTeam(editId, form);
    } else {
      await createTeam(form);
    }

    setForm({ name: "", budget: "" });
    setEditId(null);
    load();
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl text-[#D4AF37] mb-6">Teams</h1>

      <div className="bg-[#141A2E] p-6 rounded mb-6 grid md:grid-cols-3 gap-4">
        <input
          placeholder="Team Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="bg-[#0B0F1A] border border-[#D4AF37] p-2"
        />

        <input
          placeholder="Budget"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
          className="bg-[#0B0F1A] border border-[#D4AF37] p-2"
        />

        <button
          onClick={handleSubmit}
          className="bg-[#D4AF37] text-black p-2 rounded"
        >
          {editId ? "Update Team" : "Add Team"}
        </button>
      </div>

      {teams.map((t) => (
        <div key={t._id}
          className="bg-[#141A2E] p-4 rounded mb-3 flex justify-between">
          <div>
            <p>{t.name}</p>
            <p className="text-[#D4AF37]">
              Budget: ₹{t.budget} | Remaining: ₹{t.remainingPurse} | Players: {t.playerCount}
            </p>
          </div>

          <div className="space-x-3">
            <button
              onClick={() => {
                setEditId(t._id);
                setForm(t);
              }}
              className="bg-blue-500 px-3 py-1 rounded"
            >
              Edit
            </button>

            <button
              onClick={() => deleteTeam(t._id).then(load)}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </AdminLayout>
  );
}
