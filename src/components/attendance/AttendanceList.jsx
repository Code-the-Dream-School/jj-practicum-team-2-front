import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../../services/api';

const AttendanceList = ({ sessionId }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const data = await dashboardAPI.getSessionAttendance(sessionId);
        setStudents(data.students);
      } catch (err) {
        console.error('Error fetching attendance:', err);
      }
    };

    fetchAttendance();
  }, [sessionId]);

  return (
    <div>
      <h3>Attendance List</h3>
      <ul>
        {students.map((student) => (
          <li key={student._id}>
            {student.name} — {student.attended ? 'Present' : 'Absent'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttendanceList;
