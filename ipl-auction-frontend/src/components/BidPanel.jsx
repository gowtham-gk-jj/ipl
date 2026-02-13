import { useState } from "react";

function BidPanel({ player }) {
  const [bid, setBid] = useState(player.basePrice);

  const increaseBid = () => {
    setBid(bid + 500000);
  };

  return (
    <div className="bid-panel">
      <h3>{player.name}</h3>
      <h2>Current Bid: ₹{bid}</h2>
      <button onClick={increaseBid}>Increase Bid</button>
    </div>
  );
}

export default BidPanel;
