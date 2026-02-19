import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user } = useContext(AuthContext);

  // Backup from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const currentUser = user || storedUser;

  // Not logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (roles && !roles.includes(currentUser.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
