import React, { useEffect, useState } from "react";
import { dashboardAPI } from "../../services/api";

const AttendanceList = ({ sessionId }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setError('Session ID is required');
      setLoading(false);
      return;
    }

    const fetchAttendance = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dashboardAPI.getSessionAttendance(sessionId);
        
        if (data.attendanceData && Array.isArray(data.attendanceData)) {
          setAttendanceData(data.attendanceData);
          setSessionInfo({
            title: data.sessionTitle,
            date: new Date(data.sessionDate).toLocaleDateString(),
            totalParticipants: data.totalParticipants,
            totalAttendees: data.totalAttendees || 0
          });
        } else {
          setError('Invalid attendance data received');
        }
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setError(err.response?.data?.message || err.message || 'Failed to load attendance data');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [sessionId]);

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
        <p className="text-gray-600">No participants found for this session.</p>
      </div>
    );
  }

  const attendancePercentage = sessionInfo ? 
    Math.round((sessionInfo.totalAttendees / sessionInfo.totalParticipants) * 100) : 0;

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Attendance List</h3>
      
      {sessionInfo && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900">{sessionInfo.title}</h4>
          <p className="text-sm text-blue-700">Date: {sessionInfo.date}</p>
          <div className="mt-2 flex items-center space-x-4">
            <span className="text-sm text-blue-700">
              Attendance: {sessionInfo.totalAttendees}/{sessionInfo.totalParticipants} 
              ({attendancePercentage}%)
            </span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {attendanceData.map((student) => (
          <div 
            key={student.id} 
            className={`flex items-center justify-between p-3 rounded-lg border ${
              student.isPresent 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                student.isPresent ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
              <div>
                <p className="font-medium text-gray-900">{student.name}</p>
                <p className="text-xs text-gray-500">{student.email}</p>
              </div>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              student.isPresent 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {student.isPresent ? 'Present' : 'Absent'}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Total Participants: {attendanceData.length}</span>
          <span>Present: {attendanceData.filter(s => s.isPresent).length}</span>
          <span>Absent: {attendanceData.filter(s => !s.isPresent).length}</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceList;
