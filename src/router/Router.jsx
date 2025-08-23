import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "../components/common/ProtectedRoute";
import DashboardRedirect from "../components/common/DashboardRedirect";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import StudentDashboard from "../pages/StudentDashboard";
import MentorDashboard from "../pages/MentorDashboard";
import StudentProfile from "../pages/StudentProfile";
import MentorProfile from "../pages/MentorProfile";
import SessionsPage from "../pages/SessionsPage";
import RecordingsPage from "../pages/RecordingsPage";
import NotificationsPage from "../pages/NotificationsPage";
import BrowseMentorsPage from "../pages/BrowseMentorsPage";
import MySessionsPage from "../pages/MySessionsPage";
import StudentsPage from "../pages/StudentsPage";
import ReportsPage from "../pages/ReportsPage";
import SessionManagementPage from "../pages/SessionManagementPage";
import AttendancePage from "../pages/AttendancePage";
import NotFoundPage from "../pages/NotFoundPage";

const Router = () => {
  return (
    <BrowserRouter>
      <Layout>
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
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

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
          <Route
            path="/students"
            element={
              <ProtectedRoute requiredRole="mentor">
                <StudentsPage />
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

          {/* 404 page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default Router;
