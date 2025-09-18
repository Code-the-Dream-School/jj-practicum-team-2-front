import { useState, useEffect } from "react";
import { dashboardAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export const useDashboard = () => {
  const { isMentor } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    thisWeek: {
      inProgress: [],
      upcoming: [],
      past: [],
      pastSessions: [], // for mentor dashboard
    },
    myRegistrations: [],
    stats: {
      attendedThisWeek: 0,
      upcomingThisWeek: 0,
      plannedThisWeek: 0,
      weeklyGoalMet: false,
      totalSessions: 0, // for mentor
      totalParticipants: 0, // for mentor
      upcomingSessions: 0, // for mentor
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate weekly goal status
  const calculateWeeklyGoal = (data) => {
    const goalTarget = data.stats?.weeklyGoal || 3;
    const attendedCount = data.stats.attendedThisWeek;

    return {
      ...data.stats,
      weeklyGoal: goalTarget,
      weeklyGoalMet: attendedCount >= goalTarget,
    };
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use appropriate API based on user role
      if (isMentor()) {
        const data = await dashboardAPI.getMentorDashboard();
        console.log("Mentor dashboard data loaded:", data);
        setDashboardData(data);
      } else {
        const data = await dashboardAPI.getStudentDashboard();
        console.log("Student dashboard data loaded:", data);
        setDashboardData({
          ...data,
          stats: calculateWeeklyGoal(data),
        });
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
      setError(err.response?.data?.message || "Failed to load dashboard");
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

      return { success: true, message: "Successfully registered for session!" };
    } catch (err) {
      let errorMessage = "Failed to register for session";

      if (err.response?.status === 404) {
        errorMessage = "Session not found. It may have been canceled.";
      } else if (err.response?.status === 400) {
        errorMessage =
          err.response.data?.message || "Unable to register for this session";
      } else if (err.response?.status === 401) {
        errorMessage = "Please log in to register for sessions";
      }

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
        message: "Successfully unregistered from session!",
      };
    } catch (err) {
      let errorMessage = "Failed to unregister from session";

      if (err.response?.status === 404) {
        errorMessage = "Session not found. You may already be unregistered.";
      } else if (err.response?.status === 400) {
        errorMessage =
          err.response.data?.message ||
          "Unable to unregister from this session";
      }

      return { success: false, message: errorMessage };
    }
  };

  const updateWeeklyGoal = async (newGoal) => {
    try {
      await dashboardAPI.updateWeeklyGoal(newGoal);

      // Update local state
      setDashboardData((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          weeklyGoal: newGoal,
          weeklyGoalMet: prev.stats.attendedThisWeek >= newGoal,
        },
      }));

      return { success: true, message: "Weekly goal updated successfully!" };
    } catch (err) {
      console.error("Weekly goal update error:", err);

      // Extract the actual error message from the response
      let errorMessage = "Failed to update weekly goal";

      if (err.response?.status === 400) {
        errorMessage =
          err.response.data?.message || "Invalid weekly goal value";
      } else if (err.response?.status === 401) {
        errorMessage = "Please log in to update your weekly goal";
      } else if (
        err.message &&
        !err.message.includes("Failed to update weekly goal")
      ) {
        // Avoid circular error messages
        errorMessage = err.message;
      }

      throw new Error(errorMessage);
    }
  };

  const markAttendance = async (sessionId, attendeeIds) => {
    try {
      await dashboardAPI.markAttendance(sessionId, attendeeIds);

      await loadDashboard();

      return { success: true, message: "Attendance marked successfully!" };
    } catch (err) {
      let errorMessage = "Failed to mark attendance";

      if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || "Invalid attendance data";
      } else if (err.response?.status === 401) {
        errorMessage = "Please log in to mark attendance";
      } else if (err.response?.status === 404) {
        errorMessage = "Session not found";
      }

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
    refreshDashboard: loadDashboard, // Add alias for refresh functionality
    registerForSession,
    unregisterFromSession,
    updateWeeklyGoal,
    markAttendance,
  };
};
