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

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes without Layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Protected routes with Layout */}
        <Route
          path="/"
          element={
            <Layout>
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/dashboard"
          element={
            <Layout>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/sessions"
          element={
            <Layout>
              <ProtectedRoute>
                <SessionsPage />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/recordings"
          element={
            <Layout>
              <ProtectedRoute>
                <RecordingsPage />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/notifications"
          element={
            <Layout>
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            </Layout>
          }
        />

        {/* Role-based profile routes */}
        <Route
          path="/student-profile"
          element={
            <Layout>
              <ProtectedRoute requiredRole="student">
                <StudentProfile />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/mentor-profile"
          element={
            <Layout>
              <ProtectedRoute requiredRole="mentor">
                <MentorProfile />
              </ProtectedRoute>
            </Layout>
          }
        />

        {/* Student-specific routes */}
        <Route
          path="/mentors"
          element={
            <Layout>
              <ProtectedRoute requiredRole="student">
                <BrowseMentorsPage />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/my-sessions"
          element={
            <Layout>
              <ProtectedRoute requiredRole="student">
                <MySessionsPage />
              </ProtectedRoute>
            </Layout>
          }
        />

        {/* Mentor-only routes */}
        <Route
          path="/students"
          element={
            <Layout>
              <ProtectedRoute requiredRole="mentor">
                <BrowseStudentsPage />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/reports"
          element={
            <Layout>
              <ProtectedRoute requiredRole="mentor">
                <ReportsPage />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/manage-sessions"
          element={
            <Layout>
              <ProtectedRoute requiredRole="mentor">
                <SessionManagementPage />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/attendance"
          element={
            <Layout>
              <ProtectedRoute requiredRole="mentor">
                <AttendancePage />
              </ProtectedRoute>
            </Layout>
          }
        />

        {/* 404 page without Layout */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
