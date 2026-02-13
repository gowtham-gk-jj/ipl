import { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import api from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPlayers: 0,
    totalTeams: 0,
    totalRevenue: 0
  });

  const loadStats = async () => {
    try {
      const data = await api("/api/dashboard/admin");
      setStats(data);
    } catch (err) {
      console.error("Dashboard API error:", err.message);
      // Keep default 0 values if API fails
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl text-[#D4AF37] mb-6">
        Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <Card title="Total Players" value={stats.totalPlayers} />
        <Card title="Total Teams" value={stats.totalTeams} />
        <Card title="Total Revenue" value={`₹ ${stats.totalRevenue}`} />
      </div>
    </AdminLayout>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-[#141A2E] p-6 rounded shadow-lg">
      <h3>{title}</h3>
      <p className="text-2xl text-[#D4AF37]">{value}</p>
    </div>
  );
}
