import { useState } from "react";
import { resetPassword } from "../services/authService";

export default function ResetPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await resetPassword(email);
    alert("Reset link sent");
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto">
      <h2>Reset Password</h2>

      <input
        placeholder="Email"
        className="border p-2 w-full mb-3"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button className="bg-orange-500 text-white p-2 w-full">
        Reset
      </button>
    </form>
  );
}
