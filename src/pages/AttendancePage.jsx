import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import MarkAttendance from "../components/attendance/MarkAttendance";
import AttendanceList from "../components/attendance/AttendanceList";
import AttendanceStatus from "../components/attendance/AttendanceStatus";

export default function AttendancePage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const [activeTab, setActiveTab] = useState("mark");

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

  const tabs = [
    { id: "mark", label: "Mark Attendance", role: "mentor" },
    { id: "view", label: "View Attendance", role: "both" },
    { id: "status", label: "My Attendance", role: "student" }
  ];

  const visibleTabs = tabs.filter(tab => 
    tab.role === "both" || 
    (tab.role === "mentor" && user?.role === "mentor") ||
    (tab.role === "student" && user?.role === "student")
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

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "mark" && user?.role === "mentor" && (
          <MarkAttendance sessionId={sessionId} />
        )}
        
        {activeTab === "view" && (
          <AttendanceList sessionId={sessionId} />
        )}
        
        {activeTab === "status" && user?.role === "student" && (
          <AttendanceStatus />
        )}
        
        {!sessionId && activeTab !== "status" && (
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
