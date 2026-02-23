import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./auth/LoginPage.jsx";
import RegisterPage from "./auth/RegisterPage.jsx";
import DashboardPage from "./dashboard/DashboardPage.jsx";
import ResumePage from "./resume/ResumePage.jsx";

function isAuthenticated() {
  return Boolean(localStorage.getItem("mcp_token"));
}

function PrivateRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/resume"
        element={
          <PrivateRoute>
            <ResumePage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}
