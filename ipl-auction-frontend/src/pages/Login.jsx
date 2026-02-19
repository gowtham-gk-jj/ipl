import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

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

      if (!res || !res.token || !res.role) {
        alert("Invalid login response");
        return;
      }

      login({
        token: res.token,
        user: { role: res.role }
      });

      if (res.role === "admin") {
        navigate("/admin");
      } else if (res.role === "team") {
        navigate("/team");
      } else if (res.role === "host") {
        navigate("/host/auction");
      }

    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Viewer Button Click
  const handleViewerOpen = () => {
    navigate("/viewer");
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        <h1 className="login-title">🏏 IPL Auction</h1>
        <p className="login-subtitle">
          Admin / Team / Host Login
        </p>

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

        {/* 🔥 Viewer Option */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            onClick={handleViewerOpen}
            style={{
              background: "transparent",
              border: "1px solid #f5c518",
              color: "#f5c518",
              padding: "10px 18px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            👀 Open Viewer Page
          </button>
        </div>

      </div>
    </div>
  );
}
