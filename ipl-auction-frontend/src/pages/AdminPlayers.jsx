import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { getPlayers, createPlayer, updatePlayer, deletePlayer } from "../../services/playerService";

export default function AdminPlayers() {
  const [players, setPlayers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    basePrice: "",
    image: ""
  });
  const [editId, setEditId] = useState(null);

  const load = async () => {
    const data = await getPlayers();
    setPlayers(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async () => {
    if (editId) {
      await updatePlayer(editId, form);
    } else {
      await createPlayer(form);
    }

    setForm({ name: "", category: "", basePrice: "", image: "" });
    setEditId(null);
    load();
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl text-[#D4AF37] mb-6">Players</h1>

      <div className="bg-[#141A2E] p-6 rounded mb-6 grid md:grid-cols-4 gap-4">
        <input placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="bg-[#0B0F1A] border border-[#D4AF37] p-2" />

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="bg-[#0B0F1A] border border-[#D4AF37] p-2"
        >
          <option value="">Category</option>
          <option>Batsman</option>
          <option>Bowler</option>
          <option>All-Rounder</option>
          <option>Wicket Keeper</option>
        </select>

        <input placeholder="Base Price"
          value={form.basePrice}
          onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
          className="bg-[#0B0F1A] border border-[#D4AF37] p-2" />

        <input placeholder="Image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="bg-[#0B0F1A] border border-[#D4AF37] p-2" />

        <button
          onClick={handleSubmit}
          className="bg-[#D4AF37] text-black p-2 rounded col-span-4"
        >
          {editId ? "Update Player" : "Add Player"}
        </button>
      </div>

      {players.map((p) => (
        <div key={p._id}
          className="bg-[#141A2E] p-4 rounded mb-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {p.image && <img src={p.image} className="w-16 h-16 object-cover rounded" />}
            <div>
              <p>{p.name}</p>
              <p className="text-sm text-[#D4AF37]">
                {p.category} - ₹{p.basePrice}
              </p>
            </div>
          </div>

          <div className="space-x-3">
            <button
              onClick={() => {
                setEditId(p._id);
                setForm(p);
              }}
              className="bg-blue-500 px-3 py-1 rounded"
            >
              Edit
            </button>

            <button
              onClick={() => deletePlayer(p._id).then(load)}
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
