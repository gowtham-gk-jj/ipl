import { useState } from "react";
import api from "../../services/api";

export default function BidPanel({ playerId }) {
  const [amount, setAmount] = useState("");

  async function placeBid() {
    await api("/api/bid", "POST", { playerId, amount });
  }

  return (
    <div>
      <input onChange={(e) => setAmount(e.target.value)} />
      <button onClick={placeBid}>Place Bid</button>
    </div>
  );
}
