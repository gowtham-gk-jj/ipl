import { useEffect, useState } from "react";
import { getPlayers, createBulkPlayers } from "../services/playerService";
import "./AdminPlayers.css";


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
    try {
      const data = await getPlayers();
      setPlayers(data);
    } catch (err) {
      console.error("Load players error:", err);
    }
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
  <div className="players-page">

    <h1 className="players-title">
      🏏 Add 12 Players
    </h1>

    {/* Common Selection */}
    <div className="players-common-card">
      <select
        value={common.category}
        onChange={(e) =>
          setCommon({ ...common, category: e.target.value })
        }
      >
        <option value="">Select Category</option>
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
      >
        <option value="">Select Nationality</option>
        <option value="Indian">Indian</option>
        <option value="Foreign">Foreign</option>
      </select>

      <select
        value={common.capStatus}
        onChange={(e) =>
          setCommon({ ...common, capStatus: e.target.value })
        }
      >
        <option value="">Select Cap Status</option>
        <option value="Capped">Capped</option>
        <option value="Uncapped">Uncapped</option>
      </select>
    </div>

    {/* Players Grid */}
    <div className="players-form-card">
      {bulkPlayers.map((player, index) => (
        <div key={index} className="player-row">

          <input
            placeholder={`Player ${index + 1} Name`}
            value={player.name}
            onChange={(e) =>
              handlePlayerChange(index, "name", e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Base Price"
            value={player.basePrice}
            onChange={(e) =>
              handlePlayerChange(index, "basePrice", e.target.value)
            }
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handlePlayerChange(index, "image", e.target.files[0])
            }
          />

        </div>
      ))}

      <button onClick={handleBulkSubmit} className="players-submit-btn">
        Add Players
      </button>
    </div>

  </div>
);
}