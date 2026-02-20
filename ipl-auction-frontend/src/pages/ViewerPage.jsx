import { useEffect, useState } from "react";
import socket from "../services/socket";
import "./ViewerPage.css";

/* ================= PRICE FORMAT FUNCTION ================= */
const formatPrice = (amount) => {
  if (!amount) return "0";

  if (amount >= 10000000)
    return (amount / 10000000).toFixed(2).replace(/\.00$/, "") + " Cr";

  if (amount >= 100000)
    return (amount / 100000).toFixed(0) + " L";

  return amount;
};

export default function ViewerPage() {
  const [player, setPlayer] = useState(null);
  const [status, setStatus] = useState("WAITING");
  const [soldTeam, setSoldTeam] = useState("");
  const [currentBid, setCurrentBid] = useState(0);

  useEffect(() => {

    /* ================= AUCTION START ================= */
    socket.on("auctionPlayer", (data) => {
      // data = { player, highestBid, highestBidder }
      setPlayer(data.player);              // ✅ FIX
      setCurrentBid(data.highestBid);
      setStatus("LIVE");
      setSoldTeam("");
    });

    /* ================= BID UPDATE ================= */
    socket.on("bidUpdate", ({ highestBid }) => {
      setCurrentBid(highestBid);
    });

    /* ================= AUCTION ENDED ================= */
    socket.on("auctionEnded", (data) => {
      if (data.highestBidder) {
        setStatus("SOLD");
        setCurrentBid(data.highestBid);
        setSoldTeam(data.highestBidder);
      } else {
        setStatus("UNSOLD");
      }
    });

    return () => {
      socket.off("auctionPlayer");
      socket.off("bidUpdate");
      socket.off("auctionEnded");
    };

  }, []);

  return (
    <div className="tv-container">

      {!player ? (
        <div className="waiting-screen">
          <h1>🏏 IPL LIVE AUCTION</h1>
          <p>Waiting for Auction...</p>
        </div>
      ) : (
        <div className="tv-main">

          {/* PLAYER IMAGE */}
          <div className="tv-image-box">
            <img
              src={
                player.image
                  ? player.image      // ✅ Cloudinary full URL
                  : "/default-player.png"
              }
              alt={player.name}
              className="tv-image"
            />
          </div>

          {/* PLAYER DETAILS */}
          <div className="tv-info">

            <h1 className="player-name">
              {player.name}
            </h1>

            <div className="player-meta">
              {player.category} | {player.nationality} | {player.capStatus}
            </div>

            <div className="player-price">
              ₹ {formatPrice(currentBid)}
            </div>

            {status === "LIVE" && (
              <div className="status live">🔴 LIVE</div>
            )}

            {status === "SOLD" && (
              <div className="status sold">
                SOLD TO <span>{soldTeam}</span>
              </div>
            )}

            {status === "UNSOLD" && (
              <div className="status unsold">
                UNSOLD
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}