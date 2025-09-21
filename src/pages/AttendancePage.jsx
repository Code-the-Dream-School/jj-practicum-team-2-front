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

  // Set initial tab based on user role and sessionId
  useEffect(() => {
    if (sessionId && user?.role === "mentor") {
      setActiveTab("mark");
    } else if (user?.role === "student") {
      setActiveTab("status");
    } else if (user?.role === "mentor") {
      setActiveTab("view");
    }
  }, [sessionId, user?.role]);

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Attendance Management
        {sessionId && (
          <span className="text-sm font-normal text-gray-600 ml-2">
            (Session ID: {sessionId})
          </span>
        )}
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
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
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
            className="block text-sm font-medium text-gray-700"
          >
            Select Session
          </label>
          <select
            id="session-select"
            value={selectedSession}
            onChange={(e) => handleSessionChange(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select a session</option>
            {availableSessions.map((session) => (
              <option key={session._id} value={session._id}>
                {formatSessionOption(session)}
              </option>
            ))}
          </select>
          {loading && (
            <p className="text-sm text-gray-500">Loading sessions...</p>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )}

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "mark" && user?.role === "mentor" && (
          <MarkAttendance sessionId={selectedSession} />
        )}

        {activeTab === "view" && <AttendanceList sessionId={selectedSession} />}

        {activeTab === "status" && user?.role === "student" && (
          <AttendanceStatus />
        )}

        {!selectedSession && activeTab !== "status" && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700">
              Please select a session to view or mark attendance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
