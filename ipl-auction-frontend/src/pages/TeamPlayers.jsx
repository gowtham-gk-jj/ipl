import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./TeamPlayers.css";

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN").format(amount || 0);

export default function TeamPlayers() {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [collapsed, setCollapsed] = useState(
    window.innerWidth < 768
  );
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    category: "",
    nationality: "",
    capStatus: "",
  });

  /* ================= LOAD PLAYERS ================= */
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await api("/api/players");
        setPlayers(data);
        setFilteredPlayers(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPlayers();
  }, []);

  /* ================= FILTER LOGIC ================= */
  useEffect(() => {
    let temp = players;

    if (filters.category)
      temp = temp.filter((p) => p.category === filters.category);

    if (filters.nationality)
      temp = temp.filter((p) => p.nationality === filters.nationality);

    if (filters.capStatus)
      temp = temp.filter((p) => p.capStatus === filters.capStatus);

    setFilteredPlayers(temp);
  }, [filters, players]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="players-layout">

      {/* MENU BUTTON */}
      <button
        className="menu-btn"
        onClick={() => setCollapsed(!collapsed)}
      >
        ☰
      </button>

      {/* SIDEBAR */}
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <h2>🏏 Team Panel</h2>

        <button onClick={() => navigate("/team")}>
          📊 Dashboard
        </button>

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
      <div className="players-container">

        <h1 className="players-title">👥 Player List</h1>

        {/* FILTER SECTION */}
        <div className="filter-section">
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            <option value="">All Types</option>
            <option>Batsman</option>
            <option>Bowler</option>
            <option>All-Rounder</option>
            <option>Wicket Keeper</option>
          </select>

          <select
            value={filters.nationality}
            onChange={(e) =>
              setFilters({ ...filters, nationality: e.target.value })
            }
          >
            <option value="">Indian / Foreign</option>
            <option value="Indian">Indian</option>
            <option value="Foreign">Foreign</option>
          </select>

          <select
            value={filters.capStatus}
            onChange={(e) =>
              setFilters({ ...filters, capStatus: e.target.value })
            }
          >
            <option value="">Capped / Uncapped</option>
            <option value="Capped">Capped</option>
            <option value="Uncapped">Uncapped</option>
          </select>
        </div>

        {/* PLAYER CARDS */}
        <div className="players-grid">
          {filteredPlayers.map((player) => (
            <div key={player._id} className="player-card">

              <div className="player-header">
                <h2>{player.name}</h2>
                <span className="type-badge">
                  {player.category}
                </span>
              </div>

              <div className="player-info">
                <p><strong>Nationality:</strong> {player.nationality}</p>
                <p><strong>Status:</strong> {player.capStatus}</p>
              </div>

              <div className="price-section">
                Base Price: ₹ {formatPrice(player.basePrice)}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
