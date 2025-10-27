// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // Use environment variable if explicitly set
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Check if we're on specific production domains (strict checking)
  const currentDomain = window.location.hostname;
  const allowedProductionDomains = ["mentorhub-nmn2.onrender.com"];

  if (allowedProductionDomains.includes(currentDomain)) {
    return "https://jj-practicum-team-2-back.onrender.com";
  }

  // Log warning for unexpected domains in production-like environments
  if (
    import.meta.env.PROD &&
    !allowedProductionDomains.includes(currentDomain)
  ) {
    console.warn("Unexpected production domain detected:", currentDomain);
  }

  // Default to localhost for development
  return "http://localhost:8000";
};

export const API_BASE_URL = getApiBaseUrl() + "/api/v1";

export const API_ENDPOINTS = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  PROFILE: "/auth/profile",
  CHECK_AUTH: "/auth/me",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  MAIN: "/",
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",

  DASHBOARD: "/dashboard",
  STUDENT_DASHBOARD: "/student-dashboard",
  MENTOR_DASHBOARD: "/mentor-dashboard",
  STUDENT_PROFILE: "/student-profile",
  MENTOR_PROFILE_PAGE: "/mentor-profile",

  SESSIONS: "/sessions",
  SESSION_DETAIL: "/sessions/:id",
  CREATE_SESSION: "/sessions/create",
  EDIT_SESSION: "/sessions/:id/edit",

  RECORDINGS: "/recordings",

  NOTIFICATIONS: "/notifications",

  BROWSE_MENTORS: "/mentors",
  MENTOR_PROFILE: "/mentors/:id",
  MY_SESSIONS: "/my-sessions",

  STUDENTS: "/students",
  REPORTS: "/reports",
  SESSION_MANAGEMENT: "/manage-sessions",
  ATTENDANCE: "/attendance",

  NOT_FOUND: "/404",
};

export const USER_ROLES = {
  STUDENT: "student",
  MENTOR: "mentor",
};
