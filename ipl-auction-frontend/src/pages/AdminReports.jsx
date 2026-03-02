import api from "../services/api";
import "./AdminReports.css";

export default function AdminReports() {

  const exportCSV = async () => {
  try {
    const response = await fetch(
      "https://ipl-c9o8.onrender.com/api/reports/export",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to download report");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "auction_report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Export error:", error);
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