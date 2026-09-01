import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Missions from "./pages/Missions";
// import Calendar from "./pages/Calendar";
// import Documents from "./pages/Documents";
// import Portfolio from "./pages/Portfolio";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Page par défaut */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Page publique */}
      <Route path="/login" element={<Login />} />

      {/* Pages protégées */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/missions" element={<Missions />} />
        {/* <Route path="/calendar" element={<Calendar />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/portfolio" element={<Portfolio />} /> */}
      </Route>
    </Routes>
  );
}

export default App;