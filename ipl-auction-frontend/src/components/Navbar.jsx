import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar">
      <h2>IPL Auction</h2>
      <div>
        <Link to="/">Home</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/team">Team</Link>
      </div>
    </div>
  );
}

export default Navbar;
