import React from "react";

const AttendanceStatus = ({ sessions }) => {
  return (
    <div>
      <h3>Your Attendance History</h3>
      <ul>
        {sessions.map((session) => (
          <li key={session._id}>
            {session.title} — {session.attended ? "Present" : "Absent"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttendanceStatus;
