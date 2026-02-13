import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Players", path: "/admin/players" },
    { name: "Teams", path: "/admin/teams" },
    { name: "Reports", path: "/admin/reports" }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white flex">

      {/* Sidebar */}
      <div className={`fixed md:static z-50 bg-[#141A2E] w-64 h-full p-6 transform 
      ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform`}>

        <h2 className="text-2xl font-bold text-[#D4AF37] mb-8">
          IPL Admin
        </h2>

        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block mb-4 p-2 rounded 
            ${location.pathname === item.path ? "bg-[#D4AF37] text-black" : "hover:text-[#D4AF37]"}`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 md:ml-0">
        <button
          className="md:hidden mb-4 bg-[#D4AF37] text-black px-4 py-2 rounded"
          onClick={() => setOpen(!open)}
        >
          Menu
        </button>

        {children}
      </div>
    </div>
  );
}
