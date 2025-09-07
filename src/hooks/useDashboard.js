import { useState, useEffect } from "react";
import { dashboardAPI } from "../services/api";

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    thisWeek: {
      inProgress: [],
      upcoming: [],
      past: [],
    },
    myRegistrations: [],
    stats: {
      attendedThisWeek: 0,
      upcomingThisWeek: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardAPI.getStudentDashboard();
      setDashboardData(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const registerForSession = async (sessionId) => {
    try {
      await dashboardAPI.registerForSession(sessionId);

      setDashboardData((prev) => ({
        ...prev,
        myRegistrations: [...prev.myRegistrations, sessionId],
      }));

      return { success: true, message: "Successfully registered for session" };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to register for session";
      return { success: false, message: errorMessage };
    }
  };

  const unregisterFromSession = async (sessionId) => {
    try {
      await dashboardAPI.unregisterFromSession(sessionId);

      setDashboardData((prev) => ({
        ...prev,
        myRegistrations: prev.myRegistrations.filter((id) => id !== sessionId),
      }));

      return {
        success: true,
        message: "Successfully unregistered from session",
      };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to unregister from session";
      return { success: false, message: errorMessage };
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return {
    dashboardData,
    loading,
    error,
    loadDashboard,
    registerForSession,
    unregisterFromSession,
  };
};
