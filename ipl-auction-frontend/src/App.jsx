import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";

import Login from "./pages/Login";

import AdminDashboard from "./pages/AdminDashboard";
import AdminPlayers from "./pages/AdminPlayers";
import AdminTeams from "./pages/AdminTeams";
import AdminReports from "./pages/AdminReports";
import AdminLayout from "./components/layout/AdminLayout";

import HostAuction from "./pages/HostAuction";

import TeamDashboard from "./pages/TeamDashboard";
import TeamPlayers from "./pages/TeamPlayers";
import TeamAuction from "./pages/TeamAuction";
import TeamBidHistory from "./pages/TeamBidHistory";

import ViewerPage from "./pages/ViewerPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Default */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* ================= ADMIN ================= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="players" element={<AdminPlayers />} />
            <Route path="teams" element={<AdminTeams />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>

          {/* ================= HOST ================= */}
          <Route
            path="/host/auction"
            element={
              <ProtectedRoute roles={["host"]}>
                <HostAuction />
              </ProtectedRoute>
            }
          />

          {/* ================= TEAM ================= */}
          <Route
            path="/team"
            element={
              <ProtectedRoute roles={["team"]}>
                <TeamDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/team/players"
            element={
              <ProtectedRoute roles={["team"]}>
                <TeamPlayers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/team/auction"
            element={
              <ProtectedRoute roles={["team"]}>
                <TeamAuction />
              </ProtectedRoute>
            }
          />

          <Route
            path="/team/history"
            element={
              <ProtectedRoute roles={["team"]}>
                <TeamBidHistory />
              </ProtectedRoute>
            }
          />

          {/* ================= PUBLIC ================= */}
          <Route path="/viewer" element={<ViewerPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
