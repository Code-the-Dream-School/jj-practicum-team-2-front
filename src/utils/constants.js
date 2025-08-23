export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000") + "/api/v1";

export const API_ENDPOINTS = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  PROFILE: "/auth/profile",
  MAIN: "/",
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",

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
