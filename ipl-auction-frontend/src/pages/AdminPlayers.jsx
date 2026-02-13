import { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import { getPlayers, createBulkPlayers } from "../services/playerService";

export default function AdminPlayers() {
  const [players, setPlayers] = useState([]);

  const [common, setCommon] = useState({
    category: "",
    nationality: "",
    capStatus: ""
  });

  const [bulkPlayers, setBulkPlayers] = useState(
    Array.from({ length: 12 }, () => ({
      name: "",
      basePrice: "",
      image: null
    }))
  );

  const load = async () => {
    const data = await getPlayers();
    setPlayers(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handlePlayerChange = (index, field, value) => {
    const updated = [...bulkPlayers];
    updated[index][field] = value;
    setBulkPlayers(updated);
  };

  const resetForm = () => {
    setBulkPlayers(
      Array.from({ length: 12 }, () => ({
        name: "",
        basePrice: "",
        image: null
      }))
    );
  };

  const handleBulkSubmit = async () => {
  if (!common.category || !common.nationality || !common.capStatus) {
    return alert("Please select Category, Nationality and Cap Status");
  }

  const formData = new FormData();
  formData.append("category", common.category);
  formData.append("nationality", common.nationality);
  formData.append("capStatus", common.capStatus);

  let validCount = 0;

  bulkPlayers.forEach((player, index) => {
    if (player.name.trim() !== "" && player.basePrice !== "") {
      formData.append(`name_${index}`, player.name);
      formData.append(`price_${index}`, player.basePrice);

      if (player.image) {
        formData.append(`image_${index}`, player.image);
      }

      validCount++;
    }
  });

  if (validCount === 0) {
    return alert("Please fill at least one player row");
  }

  try {
    await createBulkPlayers(formData);
    alert(`${validCount} Players Added Successfully!`);
    resetForm();
    load();
  } catch (err) {
    console.error(err);
    alert("Error adding players");
  }
};


  return (
    <AdminLayout>
      <h1 className="text-3xl text-[#D4AF37] mb-6">Add 12 Players</h1>

      {/* COMMON SECTION */}
      <div className="bg-[#141A2E] p-6 rounded mb-6 grid md:grid-cols-3 gap-4">

        <select
          value={common.category}
          onChange={(e) =>
            setCommon({ ...common, category: e.target.value })
          }
          className="bg-[#0B0F1A] border border-[#D4AF37] p-2"
        >
          <option value="">Category</option>
          <option>Batsman</option>
          <option>Bowler</option>
          <option>All-Rounder</option>
          <option>Wicket Keeper</option>
        </select>

        <select
          value={common.nationality}
          onChange={(e) =>
            setCommon({ ...common, nationality: e.target.value })
          }
          className="bg-[#0B0F1A] border border-[#D4AF37] p-2"
        >
          <option value="">Indian / Foreign</option>
          <option value="Indian">Indian</option>
          <option value="Foreign">Foreign</option>
        </select>

        <select
          value={common.capStatus}
          onChange={(e) =>
            setCommon({ ...common, capStatus: e.target.value })
          }
          className="bg-[#0B0F1A] border border-[#D4AF37] p-2"
        >
          <option value="">Capped / Uncapped</option>
          <option value="Capped">Capped</option>
          <option value="Uncapped">Uncapped</option>
        </select>
      </div>

      {/* 12 PLAYER ROWS */}
      <div className="bg-[#141A2E] p-6 rounded mb-6">
        {bulkPlayers.map((player, index) => (
          <div key={index} className="grid md:grid-cols-3 gap-4 mb-4">

            <input
              placeholder={`Player ${index + 1} Name`}
              value={player.name}
              onChange={(e) =>
                handlePlayerChange(index, "name", e.target.value)
              }
              className="bg-[#0B0F1A] border border-[#D4AF37] p-2"
            />

            <input
              type="number"
              placeholder="Base Price"
              value={player.basePrice}
              onChange={(e) =>
                handlePlayerChange(index, "basePrice", e.target.value)
              }
              className="bg-[#0B0F1A] border border-[#D4AF37] p-2"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handlePlayerChange(index, "image", e.target.files[0])
              }
              className="bg-[#0B0F1A] border border-[#D4AF37] p-2 text-white"
            />
          </div>
        ))}

        <button
          onClick={handleBulkSubmit}
          className="bg-[#D4AF37] text-black px-6 py-2 rounded mt-4"
        >
          Add Players
        </button>
      </div>
    </AdminLayout>
  );
}
