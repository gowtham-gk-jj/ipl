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
      if (editId) {
        await updateTeam(editId, form);
      } else {
        await createTeam(form);
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

        <input
          placeholder="Budget"
          type="number"
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
                Budget: ₹{t.totalBudget} | Remaining: ₹{t.remainingPurse} | Players: {t.playerCount}
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
                    totalBudget: t.totalBudget,
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
