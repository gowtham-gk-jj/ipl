import { useEffect, useState } from "react";
import socket from "../../services/socket";

export default function AuctionPanel() {
  const [player, setPlayer] = useState(null);
  const [highestBid, setHighestBid] = useState(0);

  useEffect(() => {
    socket.on("auctionUpdate", (data) => {
      setPlayer(data.player);
      setHighestBid(data.highestBid);
    });

    return () => socket.off("auctionUpdate");
  }, []);

  return (
    <div>
      <h2>Live Auction</h2>
      {player && (
        <>
          <h3>{player.name}</h3>
          <p>Highest Bid: ₹ {highestBid}</p>
        </>
      )}
    </div>
  );
}
