import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import HostAddTeam from "./pages/HostAddTeam";
import TeamDashboard from "./pages/TeamDashboard";
import AdminAuction from "./pages/AdminAuction";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Page */}
        <Route path="/" element={<Login />} />

        {/* Host Page */}
        <Route path="/host/add-team" element={<HostAddTeam />} />

        {/* Team Dashboard */}
        <Route path="/team/dashboard" element={<TeamDashboard />} />

        {/* Auction Page (optional) */}
        <Route path="/auction" element={<AdminAuction />} />
      </Routes>
    </Router>
  );
}

export default App;
