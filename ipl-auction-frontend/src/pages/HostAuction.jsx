import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import "./HostAuction.css";
import socket from "../services/socket";

/* ================= PRICE FORMAT ================= */
const formatPrice = (amount) => {
  if (!amount) return "0";

  if (amount >= 10000000)
    return (amount / 10000000).toFixed(2).replace(/\.00$/, "") + " Cr";

  if (amount >= 100000)
    return (amount / 100000).toFixed(0) + " L";

  return amount;
};

/* ================= BID INCREMENT ================= */
const getIncrement = (amount) => {
  if (amount < 10000000) return 1000000;
  if (amount < 50000000) return 2500000;
  if (amount < 100000000) return 5000000;
  return 10000000;
};

export default function HostAuction() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [allPlayers, setAllPlayers] = useState([]);
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [highestBid, setHighestBid] = useState(0);
  const [loading, setLoading] = useState(true);

  const currentPlayer = players[currentIndex];

  /* ================= SOCKET CONNECT ================= */
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
  }, []);

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    try {
      setLoading(true);

      const playerData = await api("/api/players");
      const teamData = await api("/api/teams");

      const pendingPlayers = playerData.filter((p) => !p.isSold);

      setAllPlayers(pendingPlayers);
      setPlayers(pendingPlayers);
      setTeams(teamData);
      setCurrentIndex(0);

    } catch (err) {
      console.error("Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* ================= START AUCTION ================= */
  const startAuction = () => {
    if (!currentPlayer) return;

    setHighestBid(currentPlayer.basePrice);

    socket.emit("startAuction", currentPlayer);
  };

  /* ================= INCREASE BID ================= */
  const increaseBid = () => {
    if (!currentPlayer) return;

    setHighestBid((prev) => {
      const increment = getIncrement(prev);
      const newBid = prev + increment;

      socket.emit("placeBid", { amount: newBid });

      return newBid;
    });
  };

  /* ================= SOLD ================= */
  const handleSold = async () => {
    if (!currentPlayer) return;

    if (!selectedTeam) {
      alert("Please select a team");
      return;
    }

    try {
      await api(
        `/api/auction/sold/${currentPlayer._id}`,
        "POST",
        {
          amount: highestBid,
          teamId: selectedTeam,
        }
      );

      const teamName =
        teams.find((t) => t._id === selectedTeam)?.teamName || "";

      // ✅ Emit for LIVE Viewer update
      socket.emit("playerSold", {
        teamName: teamName,
      });

      setHighestBid(0);
      setSelectedTeam("");
      await loadData();

    } catch (err) {
      alert(err.message);
    }
  };

  /* ================= UNSOLD ================= */
  const handleUnsold = async () => {
    if (!currentPlayer) return;

    try {
      await api(
        `/api/auction/unsold/${currentPlayer._id}`,
        "POST"
      );

      // ✅ Emit for LIVE Viewer update
      socket.emit("playerUnsold");

      setHighestBid(0);
      await loadData();

    } catch (err) {
      console.error(err);
    }
  };

  const moveNext = () => {
    setHighestBid(0);
    setSelectedTeam("");

    if (currentIndex < players.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (loading) {
    return <div className="auction-loading">Loading...</div>;
  }

  return (
    <div className="auction-wrapper">
      <div className="auction-header">
        🏏 LIVE IPL AUCTION
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="auction-body">

        <div className="player-section">
          {!currentPlayer ? (
            <div className="auction-finished">
              🎉 Auction Completed
            </div>
          ) : (
            <>
              <div className="player-image">
                {currentPlayer.image && (
                  <img
                    src={currentPlayer.image}
                    alt={currentPlayer.name}
                  />
                )}
              </div>

              <div className="player-details">
                <h1>{currentPlayer.name}</h1>

                <p><strong>Type:</strong> {currentPlayer.category}</p>
                <p><strong>Nationality:</strong> {currentPlayer.nationality}</p>
                <p><strong>Cap Status:</strong> {currentPlayer.capStatus}</p>

                <p className="base-price">
                  Base Price: ₹ {formatPrice(currentPlayer.basePrice)}
                </p>

                <div className="highest-bid-display">
                  ₹ {formatPrice(highestBid)}
                </div>

                {highestBid === 0 ? (
                  <button className="btn start-btn" onClick={startAuction}>
                    Start Auction
                  </button>
                ) : (
                  <>
                    <button className="btn bid-btn" onClick={increaseBid}>
                      ⬆ Increase Bid
                    </button>

                    <select
                      className="team-dropdown"
                      value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                    >
                      <option value="">Select Team</option>
                      {teams.map((team) => (
                        <option key={team._id} value={team._id}>
                          {team.teamName}
                        </option>
                      ))}
                    </select>

                    <div className="decision-buttons">
                      <button className="btn sold-btn" onClick={handleSold}>
                        ✅ Sold
                      </button>

                      <button className="btn unsold-btn" onClick={handleUnsold}>
                        ❌ Unsold
                      </button>
                    </div>
                  </>
                )}

                <button className="btn next-btn" onClick={moveNext}>
                  Next Player →
                </button>

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}