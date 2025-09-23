import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import MarkAttendance from "../components/attendance/MarkAttendance";
import AttendanceList from "../components/attendance/AttendanceList";
import AttendanceStatus from "../components/attendance/AttendanceStatus";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    if (!session) return "Invalid session";

    const date = new Date(session.date);
    if (isNaN(date))
      return `${session.title || "Unknown session"} (invalid date)`;

    const formattedDate = date.toLocaleString("en-US", {
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
    // If no session selected for mark/view tabs, show nothing or minimal content
    if ((activeTab === "mark" || activeTab === "view") && !selectedSession) {
      return null; // Simply return nothing instead of showing the message
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8">
      {/* Header Section */}
      <div className="app-header">
        <div className="app-header__avatar">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "var(--accent-color)" }}
          >
            <ClipboardDocumentListIcon className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="app-header__content">
          <h1 className="app-header__title">Attendance Management</h1>
          <p className="app-header__description">
            Track and manage student attendance.
            <br />
            Keep records of all your sessions.
          </p>
        </div>
      </div>

      {/* Content Container */}
      <div className="w-full max-w-4xl mt-6 space-y-6">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-3 justify-center">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 min-w-[140px] cursor-pointer ${
                activeTab === tab.id
                  ? "text-white shadow-lg hover:bg-opacity-90"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm"
              }`}
              style={activeTab === tab.id ? { backgroundColor: "#10B981" } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Session Selector Card for Mentors */}
        {user?.role === "mentor" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Select Session
            </h3>
            <div className="relative max-w-md mx-auto" ref={dropdownRef}>
              {/* Custom Dropdown Button */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 text-base bg-white rounded-lg focus:outline-none text-gray-900 cursor-pointer transition-all duration-200 text-left"
                style={{
                  border: "2px solid #10B981",
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(16, 185, 129, 0.2)";
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "none";
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-center flex-1">
                    {selectedSession
                      ? formatSessionOption(
                          availableSessions.find(
                            (s) => s._id === selectedSession,
                          ),
                        )
                      : "Choose a session to manage attendance..."}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="#10B981"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {/* Custom Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border-2 border-green-500 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {availableSessions.length === 0 ? (
                    <div className="px-4 py-3 text-gray-500 text-center">
                      No sessions available
                    </div>
                  ) : (
                    availableSessions.map((session) => (
                      <button
                        key={session._id}
                        type="button"
                        onClick={() => {
                          handleSessionChange(session._id);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-green-50 focus:bg-green-50 focus:outline-none transition-colors duration-150 text-center"
                      >
                        {formatSessionOption(session)}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {loading && (
              <div className="mt-3 flex items-center justify-center text-sm text-green-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                Loading sessions...
              </div>
            )}
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* Tab Content */}
        <div className="w-full">{renderTabContent()}</div>
      </div>
    </div>
  );
}
