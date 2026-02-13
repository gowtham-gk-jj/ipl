import { useState } from "react";
import axios from "axios";

function HostTeamManager() {
  const [teamName, setTeamName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAddTeam = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/team/add-team", {
        teamName,
        email,
        password,
      });

      alert(res.data.message);
      setTeamName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      alert("Error creating team");
    }
  };

  return (
    <div className="container">
      <h1>Host - Add Team</h1>

      <input
        placeholder="Team Name"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />

      <input
        placeholder="Team Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Team Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleAddTeam}>Create Team</button>
    </div>
  );
}

export default HostTeamManager;
