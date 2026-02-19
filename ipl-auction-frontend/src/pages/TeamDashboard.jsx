import { useEffect, useState } from "react";
import { getMyTeam } from "../services/teamService";
import { useNavigate } from "react-router-dom";
import "./TeamDashboard.css";

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN").format(amount || 0);

export default function TeamDashboard() {
  const [team, setTeam] = useState(null);
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!team) return <div className="loading">Loading...</div>;

  return (
    <div className="layout">

      {/* MENU BUTTON */}
      <button
        className="global-toggle"
        onClick={() => setCollapsed(!collapsed)}
      >
        ☰
      </button>

      {/* SIDEBAR */}
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <h2>🏏 Team Panel</h2>

        <button onClick={() => navigate("/team/history")}>
          📜 Team History
        </button>

        <button onClick={() => navigate("/team/players")}>
          👥 Player List
        </button>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <h1 className="dashboard-title">Team Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <p>Team Name</p>
            <h2>{team.teamName}</h2>
          </div>

          <div className="stat-card">
            <p>Total Budget</p>
            <h2>₹ {formatPrice(team.totalBudget)}</h2>
          </div>

          <div className="stat-card">
            <p>Total Spent</p>
            <h2>₹ {formatPrice(team.totalSpent)}</h2>
          </div>

          <div className="stat-card highlight">
            <p>Remaining Purse</p>
            <h2>₹ {formatPrice(team.remainingPurse)}</h2>
          </div>

          <div className="stat-card">
            <p>Players Bought</p>
            <h2>{team.playersBought}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
