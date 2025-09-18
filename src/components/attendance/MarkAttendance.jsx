import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../../services/api';

const MarkAttendance = ({ sessionId }) => {
  const [students, setStudents] = useState([]);
  const [presentIds, setPresentIds] = useState([]);

  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      try {
        const data = await dashboardAPI.getSessionAttendance(sessionId);
        setStudents(data.students);
      } catch (err) {
        console.error('Error loading students:', err);
      }
    };

    fetchEnrolledStudents();
  }, [sessionId]);

  const handleCheckboxChange = (studentId) => {
    setPresentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const submitAttendance = async () => {
    try {
      await dashboardAPI.markAttendance(sessionId, presentIds);
      alert('Attendance submitted!');
    } catch (err) {
      console.error('Error submitting attendance:', err);
    }
  };

  return (
    <div>
      <h3>Mark Attendance</h3>
      {students.map((student) => (
        <div key={student._id}>
          <label>
            <input
              type="checkbox"
              checked={presentIds.includes(student._id)}
              onChange={() => handleCheckboxChange(student._id)}
            />
            {student.name}
          </label>
        </div>
      ))}
      <button onClick={submitAttendance}>Submit</button>
    </div>
  );
};

export default MarkAttendance;
