import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./AdminLayout.css";
import { Menu } from "lucide-react";

export default function AdminLayout() {
  const [hidden, setHidden] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Players", path: "/admin/players" },
    { name: "Teams", path: "/admin/teams" },
    { name: "Reports", path: "/admin/reports" },
  ];

  // ✅ LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <div className={`sidebar ${hidden ? "hidden" : ""}`}>
        
        <div className="sidebar-header">
          🏏 IPL Admin
        </div>

        <div className="menu">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`menu-item ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* ✅ Logout Button */}
        <div className="logout-btn" onClick={handleLogout}>
          Logout
        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className={`content ${hidden ? "full" : ""}`}>
        
        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-left">
            <Menu
              size={22}
              style={{ cursor: "pointer" }}
              onClick={() => setHidden(!hidden)}
            />
            <div className="topbar-title">Admin Panel</div>
          </div>

          <div className="profile-circle">A</div>
        </div>

        {/* PAGE CONTENT */}
        <div className="page-content">
          <Outlet />
        </div>

      </div>

    </div>
  );
}
