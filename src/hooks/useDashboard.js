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
      plannedThisWeek: 0,
      weeklyGoalMet: false,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionFilter, setSessionFilter] = useState("all"); // "all" or "my"

  // Filter sessions based on current filter setting
  const getFilteredSessions = (sessions) => {
    if (sessionFilter === "my") {
      return sessions.filter(session => 
        dashboardData.myRegistrations.includes(session._id)
      );
    }
    return sessions;
  };

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

      // TEMP: Mock data for testing UI
     /* const now = new Date();
      const mockData = {
        thisWeek: {
          inProgress: [
            {
              _id: "66f234567890abcdef123456",
              title: "Npm and Async Patterns",
              courseName: "Node.js Fundamentals",
              description:
                "Learn about npm package management and asynchronous programming patterns in Node.js",
              mentorId: { firstName: "Sarah", lastName: "Johnson" },
              date: new Date(now.getTime() - 30 * 60 * 1000), // Started 30 minutes ago
              participants: [{ _id: "user1" }],
              capacity: 20,
              zoomLink: "https://zoom.us/meeting1",
              status: "ongoing",
            },
          ],
          upcoming: [
            {
              _id: "66f234567890abcdef123457",
              title: "React Component Patterns",
              courseName: "React Advanced",
              description:
                "Deep dive into advanced React component patterns and best practices",
              mentorId: { firstName: "Mike", lastName: "Davis" },
              date: new Date(now.getTime() + 2 * 60 * 60 * 1000), // In 2 hours
              participants: [],
              capacity: 25,
              status: "scheduled",
            },
            {
              _id: "66f234567890abcdef123459",
              title: "CSS Grid and Flexbox",
              courseName: "CSS Mastery",
              description: "Master modern CSS layout techniques",
              mentorId: { firstName: "Emma", lastName: "Wilson" },
              date: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
              participants: [],
              capacity: 15,
              status: "scheduled",
            },
          ],
          past: [
            {
              _id: "66f234567890abcdef123458",
              title: "Introduction to JavaScript",
              courseName: "JavaScript Basics",
              description:
                "Fundamental concepts of JavaScript programming language",
              mentorId: { firstName: "Anna", lastName: "Smith" },
              date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
              participants: [{ _id: "user1" }],
              capacity: 30,
              recordingUrl: "https://zoom.us/recording1",
              status: "completed",
              attended: true,
            },
            {
              _id: "66f234567890abcdef123460",
              title: "Git Version Control",
              courseName: "Development Tools",
              description: "Learn essential Git commands and workflows",
              mentorId: { firstName: "John", lastName: "Brown" },
              date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
              participants: [{ _id: "user1" }],
              capacity: 20,
              recordingUrl: "https://zoom.us/recording2",
              status: "completed",
              attended: false,
            },
          ],
        },
        myRegistrations: [
          "66f234567890abcdef123456",
          "66f234567890abcdef123457",
          "66f234567890abcdef123458",
          "66f234567890abcdef123460",
        ],
        stats: {
          attendedThisWeek: 1,
          upcomingThisWeek: 3,
        },
      };

      // Calculate enhanced stats with weekly goal
      const enhancedData = {
        ...mockData,
        stats: calculateWeeklyGoal(mockData),
      };

      setDashboardData(enhancedData);*/

      // Uncomment below to fetch real data from API
      const data = await dashboardAPI.getStudentDashboard();
      setDashboardData({
        ...data,
        stats: calculateWeeklyGoal(data),
      });
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

      // Update local state - add session to registrations
      setDashboardData((prev) => ({
        ...prev,
        myRegistrations: [...prev.myRegistrations, sessionId],
      }));

      return { success: true, message: "Successfully registered for session!" };
    } catch (err) {
      let errorMessage = "Failed to register for session";

      // Handle specific error cases
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

      // Update local state - remove session from registrations
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

      // Handle specific error cases
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
      console.error('Weekly goal update error:', err);
      
      // Extract the actual error message from the response
      let errorMessage = "Failed to update weekly goal";

      if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || "Invalid weekly goal value";
      } else if (err.response?.status === 401) {
        errorMessage = "Please log in to update your weekly goal";
      } else if (err.message && !err.message.includes("Failed to update weekly goal")) {
        // Avoid circular error messages
        errorMessage = err.message;
      }

      throw new Error(errorMessage);
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
    updateWeeklyGoal,
  };
};
