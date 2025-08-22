import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Import existing pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";

// Import new page stubs
import SessionsPage from "./pages/SessionsPage";
import RecordingsPage from "./pages/RecordingsPage";
import NotificationsPage from "./pages/NotificationsPage";
import StudentsPage from "./pages/StudentsPage";
import ReportsPage from "./pages/ReportsPage";
import NotFoundPage from "./pages/NotFoundPage";

import "./index.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/sessions"
              element={
                <ProtectedRoute>
                  <SessionsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recordings"
              element={
                <ProtectedRoute>
                  <RecordingsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />

            {/* Mentor-only routes */}
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/reports" element={<ReportsPage />} />

            {/* Redirect root to dashboard */}
            <Route
              path="/"
              element={
                <ProtectedRoute redirectTo="/dashboard">
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* 404 page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
