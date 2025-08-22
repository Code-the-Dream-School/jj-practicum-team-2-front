// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  // Main endpoint
  MAIN: "/",
};

// Application Routes
export const ROUTES = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // Protected routes
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  SESSIONS: "/sessions",
  SESSION_DETAIL: "/sessions/:id",
  RECORDINGS: "/recordings",
  NOTIFICATIONS: "/notifications",

  // Mentor-only routes
  CREATE_SESSION: "/sessions/create",
  EDIT_SESSION: "/sessions/:id/edit",
  SESSION_STUDENTS: "/sessions/:id/students",

  // Error routes
  NOT_FOUND: "/404",
};

// User roles
export const USER_ROLES = {
  STUDENT: "student",
  MENTOR: "mentor",
};
