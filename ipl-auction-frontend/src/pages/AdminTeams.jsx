import { useEffect, useState } from "react";
import {
  getTeams,
  createTeam,
  updateTeam,
  deleteTeam
} from "../services/teamService";
import "./AdminTeams.css";

export default function AdminTeams() {

  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({
    teamName: "",
    totalBudget: "",
    email: "",
    password: ""
  });
  const [editId, setEditId] = useState(null);

  // 🔥 Convert 20Cr / 75L to number
  const convertPrice = (value) => {
    if (!value) return 0;

    value = value.toLowerCase().replace(/\s/g, "");

    if (value.includes("cr")) {
      return parseFloat(value.replace("cr", "")) * 10000000;
    }

    if (value.includes("l")) {
      return parseFloat(value.replace("l", "")) * 100000;
    }

    return Number(value);
  };

  // 🔥 Format number to Cr/L display
  const formatPrice = (amount) => {
    if (!amount) return "0";

    if (amount >= 10000000) {
      return (amount / 10000000).toFixed(2).replace(/\.00$/, "") + "Cr";
    }

    if (amount >= 100000) {
      return (amount / 100000).toFixed(2).replace(/\.00$/, "") + "L";
    }

    return amount;
  };

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
    if (!form.teamName || !form.totalBudget) {
      alert("Team name and budget are required");
      return;
    }

    try {

      const formattedBudget = convertPrice(form.totalBudget);

      const payload = {
        ...form,
        totalBudget: formattedBudget
      };

      if (editId) {
        await updateTeam(editId, payload);
      } else {
        await createTeam(payload);
      }

      setForm({
        teamName: "",
        totalBudget: "",
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
    <div className="teams-page">

      <h1 className="teams-title">🏏 Teams Management</h1>

      {/* FORM CARD */}
      <div className="teams-form-card">

        <input
          placeholder="Team Name"
          value={form.teamName}
          onChange={(e) =>
            setForm({ ...form, teamName: e.target.value })
          }
        />

        {/* 🔥 Changed to TEXT instead of number */}
        <input
          placeholder="Budget (Ex: 20Cr or 75L)"
          type="text"
          value={form.totalBudget}
          onChange={(e) =>
            setForm({ ...form, totalBudget: e.target.value })
          }
        />

        <input
          placeholder="Team Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          placeholder="Team Password"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button onClick={handleSubmit} className="teams-submit-btn">
          {editId ? "Update Team" : "Add Team"}
        </button>
      </div>

      {/* TEAM LIST */}
      <div className="teams-list">
        {teams.map((t) => (
          <div key={t._id} className="team-card">

            <div className="team-info">
              <h3>{t.teamName}</h3>

              <p>
                Budget: ₹{formatPrice(t.totalBudget)} |
                Remaining: ₹{formatPrice(t.remainingPurse)} |
                Players: {t.playerCount}
              </p>

              {t.owner?.email && (
                <span>Email: {t.owner.email}</span>
              )}
            </div>

            <div className="team-actions">
              <button
                className="edit-btn"
                onClick={() => {
                  setEditId(t._id);
                  setForm({
                    teamName: t.teamName,
                    totalBudget: formatPrice(t.totalBudget),
                    email: t.owner?.email || "",
                    password: ""
                  });
                }}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteTeam(t._id).then(load)}
              >
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
