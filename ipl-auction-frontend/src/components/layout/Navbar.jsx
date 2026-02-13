import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="p-4 bg-black text-white flex justify-between">
      <h1>IPL Auction</h1>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/players">Players</Link>
        <Link to="/auction">Auction</Link>
        <Link to="/reports">Reports</Link>
      </div>
    </nav>
  );
}
