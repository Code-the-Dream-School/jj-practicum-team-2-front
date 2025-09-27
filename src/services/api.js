import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../utils/constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor to add Authorization header if token exists in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        "Added Authorization header to request:",
        config.url,
        token.substring(0, 20) + "...",
      );
    } else if (!token) {
      console.log("No token found in localStorage for request:", config.url);
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on 401
      localStorage.removeItem("authToken");
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

    // Store token in localStorage for Safari fallback
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }

    return response.data;
  },

  logout: async () => {
    // Remove token from localStorage before logout request
    localStorage.removeItem("authToken");
    const response = await api.delete(API_ENDPOINTS.LOGOUT);
    return response.data;
  },

  checkAuth: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

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

  getStudentAttendanceHistory: async (studentId) => {
    const response = await api.get(`/students/${studentId}/attendance`);
    return response.data;
  },
};

export const classAPI = {
  getDefaultClass: async () => {
    const response = await api.get("/classes/default");
    return response.data;
  },
};

export const mainAPI = {
  getMain: async () => {
    const response = await api.get(API_ENDPOINTS.MAIN);
    return response.data;
  },
};

export const profileAPI = {
  getProfile: async () => {
    const response = await api.get("/user/myProfile");
    return response.data;
  },

  updateProfile: async (userId, updates) => {
    const response = await api.put(`/user/${userId}`, updates);
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  },
};

export default api;
