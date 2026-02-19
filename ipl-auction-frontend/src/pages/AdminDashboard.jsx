import { useEffect, useState } from "react";
import api from "../services/api";
import "./AdminDashboard.css";

export default function AdminDashboard() {

  const [stats, setStats] = useState({
    totalPlayers: 0,
    totalTeams: 0,
  });

  const loadStats = async () => {
    try {
      // ✅ Correct way to call your custom api function
      const res = await api("/api/dashboard/admin");

      console.log("Dashboard response:", res);

      setStats({
        totalPlayers: res.totalPlayers ?? 0,
        totalTeams: res.totalTeams ?? 0,
      });

    } catch (err) {
      console.error("Dashboard API error:", err.message);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="dashboard-container">

      <h1 className="dashboard-title">
        🏏 IPL Admin Dashboard
      </h1>

      <div className="dashboard-grid">

        <div className="dashboard-card">
          <div className="card-top">
            <span className="card-title">Total Players</span>
            <span className="card-icon">👤</span>
          </div>
          <div className="card-value">{stats.totalPlayers}</div>
        </div>

        <div className="dashboard-card">
          <div className="card-top">
            <span className="card-title">Total Teams</span>
            <span className="card-icon">🏏</span>
          </div>
          <div className="card-value">{stats.totalTeams}</div>
        </div>

      </div>

      <div className="dashboard-overview">
        <h2>Auction Overview</h2>
        <p>
          Monitor players and teams participating in the IPL Auction.
          This dashboard provides system insights for the Super Admin.
        </p>
      </div>

    </div>
  );
}
