import AdminLayout from "../components/layout/AdminLayout";
import api from "../services/api";

export default function AdminReports() {

  const exportCSV = async () => {
    const data = await api("/api/reports/export");
    window.open(data.fileUrl);
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl text-[#D4AF37] mb-6">Reports</h1>

      <button
        onClick={exportCSV}
        className="bg-[#D4AF37] text-black px-6 py-3 rounded"
      >
        Export CSV
      </button>
    </AdminLayout>
  );
}
