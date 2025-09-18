import { useEffect, useState } from "react";
// import { dashboardAPI } from "../services/api"; // Keep this for backend later
import Loading from "../components/common/Loading";
import { mockSessions } from "../utils/mockAttendanceData"; // Mock data

export default function AttendancePage() {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchSessions() {
      try {
        //  Using mock data for now
        setSessions(mockSessions);
        setLoading(false);

        //  Backend version
        /*
        const data = await dashboardAPI.getMentorDashboard();
        setSessions(data.upcomingSessions || []);
        */
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setLoading(false);
      }
    }

    fetchSessions();
  }, []);

  const handleSelectSession = (session) => {
    setSelectedSessionId(session.id);
    setAttendees(session.attendees || []);
    setSelectedAttendees(session.attendees?.map((a) => a.id) || []);
    setMessage("");
  };

  const handleCheckboxChange = (studentId) => {
    setSelectedAttendees((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    try {
      // Simulated save delay
      await new Promise((res) => setTimeout(res, 800));

      //  Replace this with real API call when backend is ready
      // await dashboardAPI.markAttendance(selectedSessionId, selectedAttendees);

      setMessage("✅ Attendance saved (mock).");
    } catch (err) {
      console.error("Error saving attendance:", err);
      setMessage("❌ Failed to save attendance.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Attendance Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Session List */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Your Sessions</h2>
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {sessions.map((session) => (
              <li
                key={session.id}
                className={`p-2 rounded cursor-pointer border ${
                  selectedSessionId === session.id
                    ? "bg-success/10 border-success"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleSelectSession(session)}
              >
                <div className="font-medium">{session.title}</div>
                <div className="text-sm text-gray-600">
                  {new Date(session.date).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: Attendance Panel */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-3">Mark Attendance</h2>
          {selectedSessionId ? (
            <>
              {attendees.length === 0 ? (
                <p className="text-gray-500">
                  No students registered for this session.
                </p>
              ) : (
                <ul className="space-y-2 mb-4">
                  {attendees.map((student) => (
                    <li
                      key={student.id}
                      className="flex items-center space-x-3"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAttendees.includes(student.id)}
                        onChange={() => handleCheckboxChange(student.id)}
                      />
                      <span className="text-gray-700">
                        {student.name} ({student.email})
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <button
                className="btn btn-success"
                onClick={handleSaveAttendance}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Attendance"}
              </button>
              {message && (
                <p className="mt-3 text-sm text-gray-700">{message}</p>
              )}
            </>
          ) : (
            <p className="text-gray-500">Select a session to manage attendance.</p>
          )}
        </div>
      </div>
    </div>
  );
}
