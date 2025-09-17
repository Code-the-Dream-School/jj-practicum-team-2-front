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
      totalSessions: 0, // for mentor
      totalParticipants: 0, // for mentor
      upcomingSessions: 0, // for mentor
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      // TEMP: Mock data for testing UI - keep commented for development
      /* 
      const now = new Date();
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

      setDashboardData(enhancedData);
      */

      // Use appropriate API based on user role
      const data = isMentor() 
        ? await dashboardAPI.getMentorDashboard()
        : await dashboardAPI.getStudentDashboard();

      console.log('Dashboard data loaded:', data); 
      setDashboardData(data);
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
      
      let errorMessage = "Failed to update weekly goal";

      if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || "Invalid weekly goal value";
      } else if (err.response?.status === 401) {
        errorMessage = "Please log in to update your weekly goal";
      } else if (err.message && !err.message.includes("Failed to update weekly goal")) {
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
    registerForSession,
    unregisterFromSession,
    updateWeeklyGoal,
    markAttendance,
  };
};
