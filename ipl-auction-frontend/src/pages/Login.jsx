import { useState, useContext } from "react";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(email, password);

      // Support multiple backend response formats
      const userData = data.user ? data.user : data;
      const token = data.token;

      if (!token || !userData) {
        alert("Invalid login response from server");
        return;
      }

      // Save token & user
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      login({ token, user: userData });

      // ROLE BASED REDIRECT
      if (userData.role === "admin") {
        navigate("/admin");
      } else if (userData.role === "host") {
        navigate("/host");
      } else if (userData.role === "team") {
        navigate("/team");
      } else {
        navigate("/");
      }

    } catch (err) {
      alert(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A]">
      <form
        onSubmit={handleSubmit}
        className="bg-[#141A2E] p-8 rounded shadow-lg w-96 text-white"
      >
        <h2 className="text-2xl text-[#D4AF37] mb-6 text-center">
          IPL Auction Login
        </h2>

        <input
          placeholder="Email"
          className="border border-[#D4AF37] bg-[#0B0F1A] p-2 w-full mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border border-[#D4AF37] bg-[#0B0F1A] p-2 w-full mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-[#D4AF37] text-black w-full py-2 rounded hover:opacity-90"
        >
          Login
        </button>
      </form>
    </div>
  );
}
