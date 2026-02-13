import { useState } from "react";
import api from "../../services/api";

export default function PlayerForm() {
  const [name, setName] = useState("");

  async function handleSubmit() {
    await api("/api/players", "POST", { name });
    alert("Player Added");
  }

  return (
    <div>
      <input
        placeholder="Player Name"
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleSubmit}>Add</button>
    </div>
  );
}
