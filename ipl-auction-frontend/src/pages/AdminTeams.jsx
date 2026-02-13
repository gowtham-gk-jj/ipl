import { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import {
  getTeams,
  createTeam,
  updateTeam,
  deleteTeam
} from "../services/teamService";

export default function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({
    name: "",
    budget: "",
    email: "",
    password: ""
  });
  const [editId, setEditId] = useState(null);

  const load = async () => {
    try {
      const data = await getTeams();
      setTeams(data);
    } catch (err) {
      console.error("Load teams error:", err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.budget) {
      alert("Team name and budget are required");
      return;
    }

    try {
      if (editId) {
        await updateTeam(editId, form);
      } else {
        await createTeam(form);
      }

      setForm({
        name: "",
        budget: "",
        email: "",
        password: ""
      });

      setEditId(null);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl text-[#D4AF37] mb-6">Teams</h1>

      {/* FORM */}
      <div className="bg-[#141A2E] p-6 rounded mb-6 grid md:grid-cols-4 gap-4">

        <input
          placeholder="Team Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="bg-[#0B0F1A] border border-[#D4AF37] p-2 text-white"
        />

        <input
          placeholder="Budget"
          type="number"
          value={form.budget}
          onChange={(e) =>
            setForm({ ...form, budget: e.target.value })
          }
          className="bg-[#0B0F1A] border border-[#D4AF37] p-2 text-white"
        />

        <input
          placeholder="Team Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          className="bg-[#0B0F1A] border border-[#D4AF37] p-2 text-white"
        />

        <input
          placeholder="Team Password"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          className="bg-[#0B0F1A] border border-[#D4AF37] p-2 text-white"
        />

        <button
          onClick={handleSubmit}
          className="bg-[#D4AF37] text-black p-2 rounded col-span-4 hover:opacity-90"
        >
          {editId ? "Update Team" : "Add Team"}
        </button>
      </div>

      {/* TEAM LIST */}
      {teams.map((t) => (
        <div
          key={t._id}
          className="bg-[#141A2E] p-4 rounded mb-3 flex justify-between items-center"
        >
          <div>
            <p className="text-lg font-semibold">{t.name}</p>
            <p className="text-[#D4AF37] text-sm">
              Budget: ₹{t.budget} | Remaining: ₹{t.remainingPurse} | Players: {t.playerCount}
            </p>
            {t.owner?.email && (
              <p className="text-gray-400 text-xs">
                Email: {t.owner.email}
              </p>
            )}
          </div>

          <div className="space-x-3">
            <button
              onClick={() => {
                setEditId(t._id);
                setForm({
                  name: t.name,
                  budget: t.budget,
                  email: t.owner?.email || "",
                  password: ""
                });
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
