import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../utils/constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important: allows sending signed cookies
});

// Simplified response interceptor - no token management needed
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Dispatch custom event for auth context to handle logout
      window.dispatchEvent(
        new CustomEvent("auth-expired", {
          detail: { error: error.response?.data },
        }),
      );
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  register: async (userData) => {
    const response = await api.post(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
    return response.data;
  },

  logout: async () => {
    // Backend uses DELETE method for logout
    const response = await api.delete(API_ENDPOINTS.LOGOUT);
    return response.data;
  },

  // New method to check current authentication status
  checkAuth: async () => {
    // This endpoint is now available on backend
    const response = await api.get("/auth/me");
    return response.data;
  },

  // Forgot password functionality
  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  // Reset password functionality
  resetPassword: async (resetData) => {
    const response = await api.post("/auth/reset-password", resetData);
    return response.data;
  },
};

export const dashboardAPI = {
  getStudentDashboard: async () => {
    const response = await api.get("/sessions/student-dashboard");
    return response.data;
  },

  getMentorDashboard: async () => {
    const response = await api.get("/sessions/mentor-dashboard");
    return response.data;
  },

  updateWeeklyGoal: async (weeklyGoal) => {
    const response = await api.put("/sessions/weekly-goal", { weeklyGoal });
    return response.data;
  },

  registerForSession: async (sessionId) => {
    const response = await api.post(`/sessions/${sessionId}/register`);
    return response.data;
  },

  unregisterFromSession: async (sessionId) => {
    const response = await api.delete(`/sessions/${sessionId}/unregister`);
    return response.data;
  },

  markAttendance: async (sessionId, attendeeIds) => {
    const response = await api.post(`/sessions/${sessionId}/attendance`, {
      attendeeIds,
    });
    return response.data;
  },
  getSessionAttendance: async (sessionId) => {
    const response = await api.get(`/sessions/${sessionId}/attendance`);
    return response.data;
  },

  // ✅ GET attendance history for a student
  getStudentAttendanceHistory: async (studentId) => {
    const response = await api.get(`/students/${studentId}/attendance`);
    return response.data;
  },
};

export const mainAPI = {
  getMain: async () => {
    const response = await api.get(API_ENDPOINTS.MAIN);
    return response.data;
  },
};

export default api;
