import api from "../services/api";
import "./AdminReports.css";

export default function AdminReports() {

  const exportCSV = async () => {
    try {
      const response = await api.get("/api/reports/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "auction_report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (err) {
      console.error("Export error:", err);
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

        <button onClick={exportCSV} className="reports-btn">
          Download CSV Report
        </button>
      </div>
    </div>
  );
}