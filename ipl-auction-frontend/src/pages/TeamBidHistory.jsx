import { useEffect, useState } from "react";
import { getMyTeam } from "../services/teamService";
import { useNavigate } from "react-router-dom";
import socket from "../services/socket";
import "./TeamHistory.css";

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-IN").format(amount || 0);

export default function TeamHistory() {
  const [players, setPlayers] = useState([]);
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();

  /* ================= FETCH TEAM DATA ================= */
  const fetchHistory = async () => {
    try {
      const data = await getMyTeam();
      setPlayers(data.players || []);
    } catch (err) {
      console.error("History Fetch Error:", err);
    }
  };

  /* ================= INITIAL LOAD + SOCKET ================= */
  useEffect(() => {
    fetchHistory();

    const user = JSON.parse(localStorage.getItem("user"));

    if (user?._id) {
      socket.emit("join", user._id);
    }

    // 🔥 Listen for live sold player
    socket.on("playerSold", (data) => {
      setPlayers((prev) => {
        const exists = prev.find(p => p._id === data.player._id);
        if (exists) return prev;
        return [...prev, data.player];
      });
    });

    return () => {
      socket.off("playerSold");
    };
  }, []);

  /* ================= CALCULATE TOTAL ================= */
  const totalSpent = players.reduce(
    (sum, p) => sum + (p.soldPrice || 0),
    0
  );

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="layout">

      {/* ================= MENU BUTTON ================= */}
      <button
        className="global-toggle"
        onClick={() => setCollapsed(!collapsed)}
      >
        ☰
      </button>

      {/* ================= SIDEBAR ================= */}
      <div className={`sidebar ${collapsed ? "hide" : ""}`}>
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

      {/* ================= MAIN CONTENT ================= */}
      <div className={`main-content ${collapsed ? "expand" : ""}`}>
        <div className="history-container">

          {/* HEADER */}
          <div className="history-header">
            <h1>📜 Bought Players</h1>
            <div className="summary-box">
              <span>Total Players: {players.length}</span>
              <span>Total Spent: ₹ {formatPrice(totalSpent)}</span>
            </div>
          </div>

          {/* NO DATA */}
          {players.length === 0 ? (
            <p className="no-data">No players bought yet.</p>
          ) : (

            /* PLAYER GRID */
            <div className="history-grid">
              {players.map((player) => (
                <div className="history-card" key={player._id}>

                  <div className="card-top">
                    <h2>{player.name}</h2>
                    <span className="category-tag">
                      {player.category}
                    </span>
                  </div>

                  <div className="card-details">
                    <p>
                      <strong>Nationality:</strong>{" "}
                      {player.nationality}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {player.capStatus}
                    </p>
                    <p>
                      <strong>Base Price:</strong>{" "}
                      ₹ {formatPrice(player.basePrice)}
                    </p>
                  </div>

                  <div className="card-footer">
                    Sold Price: ₹ {formatPrice(player.soldPrice)}
                  </div>

                </div>
              ))}
            </div>

          )}
        </div>
      </div>
    </div>
  );
}
