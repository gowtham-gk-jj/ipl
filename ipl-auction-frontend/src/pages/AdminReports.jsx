import api from "../services/api";
import "./AdminReports.css";

export default function AdminReports() {

  const exportCSV = async () => {
    try {
      const data = await api("/api/reports/export");
      window.open(data.fileUrl);
    } catch (err) {
      console.error("Export error:", err.message);
      alert("Failed to export report");
    }
  };

  return (
    <div className="reports-page">

      <h1 className="reports-title">📊 Reports & Analytics</h1>

      <div className="reports-card">

        <div className="reports-info">
          <h3>Export Auction Report</h3>
          <p>
            Download complete IPL auction data including players, teams,
            budgets and revenue summary in CSV format.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="reports-btn"
        >
          Download CSV Report
        </button>

      </div>

    </div>
  );
}
