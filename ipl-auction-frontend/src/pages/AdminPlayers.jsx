import { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import {
  getPlayers,
  createPlayer,
  updatePlayer,
  deletePlayer,
  createBulkPlayers
} from "../services/playerService";

export default function AdminPlayers() {
  const [players, setPlayers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [bulkFile, setBulkFile] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    nationality: "",
    capStatus: "",
    basePrice: "",
    image: null
  });

  const load = async () => {
    const data = await getPlayers();
    setPlayers(data);
  };

  useEffect(() => {
    load();
  }, []);

  // ✅ SINGLE PLAYER SUBMIT
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("nationality", form.nationality);
    formData.append("capStatus", form.capStatus);
    formData.append("basePrice", form.basePrice);
    formData.append("image", form.image);

    if (editId) {
      await updatePlayer(editId, formData);
    } else {
      await createPlayer(formData);
    }

    resetForm();
    load();
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      nationality: "",
      capStatus: "",
      basePrice: "",
      image: null
    });
    setEditId(null);
  };

  // ✅ BULK UPLOAD FUNCTION
  const handleBulkUpload = async () => {
    if (!bulkFile) return alert("Please select CSV file");

    const formData = new FormData();
    formData.append("file", bulkFile);

    await createBulkPlayers(formData);
    alert("12 Players Uploaded Successfully!");
    setBulkFile(null);
    load();
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl text-[#D4AF37] mb-6">Players</h1>

      {/* ================= SINGLE PLAYER FORM ================= */}
      <div className="bg-[#141A2E] p-6 rounded mb-6 grid md:grid-cols-3 gap-4">

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="bg-[#0B0F1A] border border-[#D4AF37] p-2"
        />

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

        <select
          value={form.nationality}
          onChange={(e) => setForm({ ...form, nationality: e.target.value })}
          className="bg-[#0B0F1A] border border-[#D4AF37] p-2"
        >
          <option value="">Indian / Foreign</option>
          <option value="Indian">Indian</option>
          <option value="Foreign">Foreign</option>
        </select>

        <select
          value={form.capStatus}
          onChange={(e) => setForm({ ...form, capStatus: e.target.value })}
          className="bg-[#0B0F1A] border border-[#D4AF37] p-2"
        >
          <option value="">Capped / Uncapped</option>
          <option value="Capped">Capped</option>
          <option value="Uncapped">Uncapped</option>
        </select>

        <input
          type="number"
          placeholder="Base Price (Lakhs)"
          value={form.basePrice}
          onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
          className="bg-[#0B0F1A] border border-[#D4AF37] p-2"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          className="bg-[#0B0F1A] border border-[#D4AF37] p-2 text-white"
        />

        <button
          onClick={handleSubmit}
          className="bg-[#D4AF37] text-black p-2 rounded col-span-3"
        >
          {editId ? "Update Player" : "Add Player"}
        </button>
      </div>

      {/* ================= BULK UPLOAD SECTION ================= */}
      <div className="bg-[#141A2E] p-6 rounded mb-6">
        <h2 className="text-xl text-[#D4AF37] mb-4">
          Bulk Upload (Upload 12 Players via CSV)
        </h2>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => setBulkFile(e.target.files[0])}
          className="text-white mb-4"
        />

        <button
          onClick={handleBulkUpload}
          className="bg-green-600 px-4 py-2 rounded"
        >
          Upload CSV
        </button>
      </div>

      {/* ================= PLAYER LIST ================= */}
      {players.map((p) => (
        <div
          key={p._id}
          className="bg-[#141A2E] p-4 rounded mb-3 flex justify-between items-center"
        >
          <div className="flex items-center gap-4">

            {p.image && (
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${p.image}`}
                alt={p.name}
                className="w-16 h-16 object-cover rounded"
              />
            )}

            <div>
              <p className="text-lg">{p.name}</p>
              <p className="text-sm text-[#D4AF37]">
                {p.category} | {p.nationality} | {p.capStatus}
              </p>
              <p className="text-sm text-white">
                Base Price: ₹{p.basePrice} Lakhs
              </p>
            </div>
          </div>

          <div className="space-x-3">
            <button
              onClick={() => {
                setEditId(p._id);
                setForm({
                  name: p.name,
                  category: p.category,
                  nationality: p.nationality,
                  capStatus: p.capStatus,
                  basePrice: p.basePrice,
                  image: null
                });
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
