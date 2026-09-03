import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  // Récupérer le token
  const token = localStorage.getItem("token");

  // Rediriger si non connecté
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Afficher la page protégée
  return <Outlet />;
}

export default ProtectedRoute;