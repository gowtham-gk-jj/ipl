// src/pages/TeamDashboard.jsx

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getMyTeam } from "../services/teamService";
import "./TeamDashboard.css";

const formatPrice = (amount) => {
  return new Intl.NumberFormat("en-IN").format(amount);
};

export default function TeamDashboard() {
  const { user } = useContext(AuthContext);
  const [team, setTeam] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await getMyTeam();
        setTeam(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTeam();
  }, []);

  if (!team) return <div className="loading">Loading...</div>;

  return (
    <div className="team-dashboard">
      <h1 className="page-title">🏏 Team Dashboard</h1>

      <div className="card-container">
        <div className="dashboard-card">
          <h3>Team Name</h3>
          <p>{team.name}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Budget</h3>
          <p>₹ {formatPrice(team.totalBudget)}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Spent</h3>
          <p>₹ {formatPrice(team.totalSpent)}</p>
        </div>

        <div className="dashboard-card">
          <h3>Remaining Purse</h3>
          <p className="remaining">
            ₹ {formatPrice(team.remainingPurse)}
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Players Bought</h3>
          <p>{team.playersBought}</p>
        </div>
      </div>
    </div>
  );
}
