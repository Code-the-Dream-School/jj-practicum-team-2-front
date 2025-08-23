import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import DashboardRedirect from "./components/common/DashboardRedirect";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/StudentDashboard";
import MentorDashboard from "./pages/MentorDashboard";

import SessionsPage from "./pages/SessionsPage";
import RecordingsPage from "./pages/RecordingsPage";
import NotificationsPage from "./pages/NotificationsPage";
import StudentsPage from "./pages/StudentsPage";
import ReportsPage from "./pages/ReportsPage";
import NotFoundPage from "./pages/NotFoundPage";

import StudentProfile from "./pages/StudentProfile";
import MentorProfile from "./pages/MentorProfile";
import BrowseMentorsPage from "./pages/BrowseMentorsPage";
import MySessionsPage from "./pages/MySessionsPage";
import SessionManagementPage from "./pages/SessionManagementPage";
import AttendancePage from "./pages/AttendancePage";

import "./index.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Root redirect to dashboard */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              }
            />

            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Dashboard redirect to role-based dashboards */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              }
            />

            {/* Role-based dashboards */}
            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mentor-dashboard"
              element={
                <ProtectedRoute requiredRole="mentor">
                  <MentorDashboard />
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

            {/* Role-based profile routes */}
            <Route
              path="/student-profile"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mentor-profile"
              element={
                <ProtectedRoute requiredRole="mentor">
                  <MentorProfile />
                </ProtectedRoute>
              }
            />

            {/* Student-specific routes */}
            <Route
              path="/mentors"
              element={
                <ProtectedRoute requiredRole="student">
                  <BrowseMentorsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-sessions"
              element={
                <ProtectedRoute requiredRole="student">
                  <MySessionsPage />
                </ProtectedRoute>
              }
            />

            {/* Mentor-only routes */}
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/reports" element={<ReportsPage />} />

            <Route
              path="/manage-sessions"
              element={
                <ProtectedRoute requiredRole="mentor">
                  <SessionManagementPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/attendance"
              element={
                <ProtectedRoute requiredRole="mentor">
                  <AttendancePage />
                </ProtectedRoute>
              }
            />

            {/* Redirect root to appropriate dashboard */}
            <Route path="/" element={<DashboardRedirect />} />
            <Route path="/dashboard" element={<DashboardRedirect />} />

            {/* 404 page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
