import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { role, teamName } = res.data;

      // Save login info
      localStorage.setItem("role", role);
      localStorage.setItem("teamName", teamName);

      // 🔥 Redirect based on role
      if (role === "host") {
        navigate("/host/add-team");
      } else {
        navigate("/team/dashboard");
      }
    } catch (error) {
      alert("Invalid Login");
    }
  };

  return (
    <div className="container">
      <h1>IPL Auction Login</h1>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
