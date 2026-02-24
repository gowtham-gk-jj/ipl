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
  const [auction, setAuction] = useState(null);

  /* ================= SOCKET CONNECTION ================= */

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handleAuctionState = (data) => {
      console.log("📡 LIVE UPDATE:", data);
      setAuction(data);
    };

    socket.on("auctionState", handleAuctionState);

    return () => {
      socket.off("auctionState", handleAuctionState);
    };
  }, []);

  /* ================= WAITING SCREEN ================= */

  if (!auction || !auction.player) {
    return (
      <div className="tv-container">
        <div className="waiting-screen">
          <h1>🏏 IPL LIVE AUCTION</h1>
          <p>Waiting for Auction...</p>
        </div>
      </div>
    );
  }

  /* ================= MAIN VIEW ================= */

  return (
    <div className="tv-container">
      <div className="tv-main">

        {/* PLAYER IMAGE */}
        <div className="tv-image-box">
          <img
            src={auction.player.image || "/default-player.png"}
            alt={auction.player.name}
            className="tv-image"
          />
        </div>

        {/* PLAYER INFO */}
        <div className="tv-info">

          <h1 className="player-name">
            {auction.player.name}
          </h1>

          <div className="player-meta">
            {auction.player.category} |{" "}
            {auction.player.nationality} |{" "}
            {auction.player.capStatus}
          </div>

          <div className="player-price">
            ₹ {formatPrice(auction.highestBid)}
          </div>

          {auction.status === "LIVE" && (
            <div className="status live">
              🔴 LIVE BIDDING
            </div>
          )}

          {auction.status === "SOLD" && (
            <div className="status sold">
              🏆 SOLD TO <span>{auction.highestBidder}</span>
            </div>
          )}

          {auction.status === "UNSOLD" && (
            <div className="status unsold">
              ❌ UNSOLD
            </div>
          )}

        </div>

      </div>
    </div>
  );
}