import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../utils/constants";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

// Auth API calls
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post(API_ENDPOINTS.LOGOUT);
    return response.data;
  },
};

// Generic API calls
export const mainAPI = {
  // Test endpoint
  getMain: async () => {
    const response = await api.get(API_ENDPOINTS.MAIN);
    return response.data;
  },
};

export default api;
