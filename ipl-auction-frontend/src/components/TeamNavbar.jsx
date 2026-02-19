import { Link } from "react-router-dom";
import { useState } from "react";

export default function TeamNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-xl">Team Panel</h1>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        <div className="hidden md:flex gap-6">
          <Link to="/team">Dashboard</Link>
          <Link to="/team/players">Players</Link>
          <Link to="/team/auction">Auction</Link>
          <Link to="/team/history">History</Link>
        </div>
      </div>

      {open && (
        <div className="flex flex-col gap-3 mt-3 md:hidden">
          <Link to="/team">Dashboard</Link>
          <Link to="/team/players">Players</Link>
          <Link to="/team/auction">Auction</Link>
          <Link to="/team/history">History</Link>
        </div>
      )}
    </nav>
  );
}
