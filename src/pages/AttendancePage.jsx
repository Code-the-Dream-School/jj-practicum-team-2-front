import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import MarkAttendance from "../components/attendance/MarkAttendance";
import AttendanceList from "../components/attendance/AttendanceList";
import AttendanceStatus from "../components/attendance/AttendanceStatus";

export default function AttendancePage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("sessionId");
  const [activeTab, setActiveTab] = useState("mark");
  const [availableSessions, setAvailableSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(sessionId || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch mentor's sessions for attendance
  const fetchMentorSessions = async () => {
    if (user?.role !== "mentor") return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/sessions/mentor-dashboard",
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }

      const data = await response.json();

      // Get sessions that can have attendance marked (completed, ongoing, or past scheduled)
      const attendanceSessions = [
        ...data.thisWeek.inProgress,
        ...data.thisWeek.past,
      ].filter(
        (session) =>
          session.status === "completed" ||
          session.status === "ongoing" ||
          session.status === "scheduled",
      );

      setAvailableSessions(attendanceSessions);

      // If sessionId from URL exists, set it as selected
      if (sessionId && attendanceSessions.find((s) => s._id === sessionId)) {
        setSelectedSession(sessionId);
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError("Failed to load sessions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle session selection change
  const handleSessionChange = (newSessionId) => {
    setSelectedSession(newSessionId);

    // Update URL with new sessionId
    if (newSessionId) {
      navigate(`/attendance?sessionId=${newSessionId}`, { replace: true });
    } else {
      navigate("/attendance", { replace: true });
    }
  };

  // Set initial tab based on user role and sessionId (only on first load)
  useEffect(() => {
    // Only set initial tab if it's the first load (when sessionId comes from URL)
    if (sessionId && user?.role === "mentor" && !activeTab) {
      setActiveTab("mark");
    } else if (user?.role === "student") {
      setActiveTab("status");
    } else if (user?.role === "mentor" && !activeTab) {
      setActiveTab("view");
    }
  }, [user?.role]); // Remove sessionId from dependencies

  // Fetch mentor sessions on component mount
  useEffect(() => {
    if (user?.role === "mentor") {
      fetchMentorSessions();
    }
  }, [user?.role]);

  const formatSessionOption = (session) => {
    const date = new Date(session.date);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const statusEmoji = {
      completed: "✅",
      ongoing: "🔴",
      scheduled: "⏰",
      canceled: "❌",
    };

    return `${statusEmoji[session.status] || "📅"} ${session.title} - ${formattedDate}`;
  };

  const tabs = [
    { id: "mark", label: "Mark Attendance", role: "mentor" },
    { id: "view", label: "View Attendance", role: "both" },
    { id: "status", label: "My Attendance", role: "student" },
  ];

  const visibleTabs = tabs.filter(
    (tab) =>
      tab.role === "both" ||
      (tab.role === "mentor" && user?.role === "mentor") ||
      (tab.role === "student" && user?.role === "student"),
  );

  // Render content based on selected tab and session
  const renderTabContent = () => {
    // If no session selected for mark/view tabs, show selection prompt
    if ((activeTab === "mark" || activeTab === "view") && !selectedSession) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to manage attendance</h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              {activeTab === "mark" 
                ? "Select a session above to start marking attendance for your students."
                : "Choose a session above to view detailed attendance records."
              }
            </p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "mark":
        return <MarkAttendance sessionId={selectedSession} />;
      case "view":
        return <AttendanceList sessionId={selectedSession} />;
      case "status":
        return <AttendanceStatus />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Attendance Management
      </h1>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              style={{
                borderBottomColor: activeTab === tab.id ? 'var(--primary-color)' : undefined,
                color: activeTab === tab.id ? 'var(--primary-color)' : undefined
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Session Selector for Mentors */}
      {user?.role === "mentor" && (
        <div className="mb-6">
          <label
            htmlFor="session-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Session
          </label>
          <select
            id="session-select"
            value={selectedSession}
            onChange={(e) => handleSessionChange(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Choose a session to manage attendance...</option>
            {availableSessions.map((session) => (
              <option key={session._id} value={session._id}>
                {formatSessionOption(session)}
              </option>
            ))}
          </select>
          {loading && (
            <p className="text-sm text-gray-500 mt-1">Loading sessions...</p>
          )}
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
      )}

      {/* Tab Content */}
      <div className="mt-6">{renderTabContent()}</div>
    </div>
  );
}
