import React, { useEffect, useState } from "react";
import { dashboardAPI } from "../../services/api";

const MarkAttendance = ({ sessionId }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [presentIds, setPresentIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setError("Session ID is required");
      setLoading(false);
      return;
    }

    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dashboardAPI.getSessionAttendance(sessionId);

        if (data.attendanceData && Array.isArray(data.attendanceData)) {
          setAttendanceData(data.attendanceData);
          // Pre-populate with already marked attendance
          const alreadyPresent = data.attendanceData
            .filter((student) => student.isPresent)
            .map((student) => student.id);
          setPresentIds(alreadyPresent);
        } else {
          setError("Invalid attendance data received");
        }
      } catch (err) {
        console.error("Error loading attendance data:", err);
        setError(err.message || "Failed to load attendance data");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [sessionId]);

  const handleCheckboxChange = (studentId) => {
    if (!studentId) return;

    setPresentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId],
    );
  };

  const submitAttendance = async () => {
    if (!sessionId) {
      setError("Session ID is missing");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccessMessage("");

      // Validate that presentIds are valid
      const validIds = presentIds.filter((id) =>
        attendanceData.some((student) => student.id === id),
      );

      if (validIds.length !== presentIds.length) {
        setError("Some selected students are invalid");
        return;
      }

      await dashboardAPI.markAttendance(sessionId, validIds);
      setSuccessMessage(
        `Attendance submitted successfully! ${validIds.length} students marked present.`,
      );

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error submitting attendance:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to submit attendance",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-center mt-2">Loading attendance data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!attendanceData.length) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-600">No students enrolled in this session.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Mark Attendance</h3>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600">{successMessage}</p>
        </div>
      )}

      <div className="space-y-2 mb-4">
        {attendanceData.map((student) => (
          <div
            key={student.id}
            className="flex items-center p-2 hover:bg-gray-50 rounded"
          >
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={presentIds.includes(student.id)}
                onChange={() => handleCheckboxChange(student.id)}
                disabled={submitting}
                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-900">
                {student.name}
              </span>
              <span className="ml-2 text-xs text-gray-500">
                ({student.email})
              </span>
            </label>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {presentIds.length} of {attendanceData.length} students marked present
        </p>

        <button
          onClick={submitAttendance}
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Submit Attendance"}
        </button>
      </div>
    </div>
  );
};

export default MarkAttendance;
