import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // ✅ use context

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api("/api/auth/login", "POST", form);

      console.log("Login response:", res);

      if (!res || !res.token || !res.role) {
        alert("Invalid login response");
        return;
      }

      // ✅ Use context login (IMPORTANT)
      login({
        token: res.token,
        user: { role: res.role }
      });

      // Redirect by role
      if (res.role === "admin") {
        navigate("/admin");
      } else if (res.role === "team") {
        navigate("/team");
      } else if (res.role === "host") {
        navigate("/host/auction");
      } else {
        navigate("/login");
      }

    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        <h1 className="login-title">🏏 IPL Auction</h1>
        <p className="login-subtitle">Admin / Team / Host Login</p>

        <form onSubmit={handleLogin} className="login-form">

          <input
            type="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>
    </div>
  );
}
