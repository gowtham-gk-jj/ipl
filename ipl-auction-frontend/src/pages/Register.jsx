import { useState } from "react";
import { registerUser } from "../services/authService";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "team"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerUser(form);
    alert("Registered Successfully");
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Register</h2>

      <input
        placeholder="Name"
        className="border p-2 w-full mb-3"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Email"
        className="border p-2 w-full mb-3"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-3"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <select
        className="border p-2 w-full mb-3"
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="team">Team</option>
        <option value="host">Host</option>
      </select>

      <button className="bg-green-500 text-white p-2 w-full">
        Register
      </button>
    </form>
  );
}
