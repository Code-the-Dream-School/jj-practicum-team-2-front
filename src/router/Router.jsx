import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "../components/layout/Layout";
import ProtectedRoute from "../components/common/ProtectedRoute";
import DashboardRedirect from "../components/common/DashboardRedirect";
import Dashboard from "../components/common/Dashboard";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import StudentProfile from "../pages/StudentProfile";
import MentorProfile from "../pages/MentorProfile";
import BrowseStudentsPage from "../pages/BrowseStudentsPage";
import BrowseMentorsPage from "../pages/BrowseMentorsPage";
import SessionsPage from "../pages/SessionsPage";
import MySessionsPage from "../pages/MySessionsPage";
import SessionManagementPage from "../pages/SessionManagementPage";
import AttendancePage from "../pages/AttendancePage";
import NotificationsPage from "../pages/NotificationsPage";
import RecordingsPage from "../pages/RecordingsPage";
import ReportsPage from "../pages/ReportsPage";
import NotFoundPage from "../pages/NotFoundPage";

// New imports for homepage and auth pages
import NoPage from "../pages/NoPage";
import SignUp from "../features/auth/pages/SignupPage";
import Login from "../features/auth/pages/LoginPage";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public homepage route ("/") */}
        <Route
          path="/"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-slate-800 mb-4">MentorHub</h1>
                <p className="text-lg text-slate-600">
                  Welcome to MentorHub! Your gateway to connecting with mentors and
                  advancing your career.
                </p>
              </div>
            </div>
          }
        />

        {/* Public auth-related routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Protected routes with layout */}
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
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
          <Route
            path="/students"
            element={
              <ProtectedRoute requiredRole="mentor">
                <BrowseStudentsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute requiredRole="mentor">
                <ReportsPage />
              </ProtectedRoute>
            }
          />

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
        </Route>

        {/* Fallback for undefined routes */}
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;