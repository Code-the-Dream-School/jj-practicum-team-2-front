import {useState, useEffect } from "react";
import React from "react";

export default function Profile() {

    const [user, setUser] = useState(null);

    useEffect(() => {
    // TODO: Replace with your real API call
    setUser({
      name: "John Doe",
      email: "john.doe@example.com",
      sessionsAttended: 12,
      sessionsThisWeek: 2,
      upcomingSessions: 1,
      reviewerName: "Sarah Johnson",
      reviewerEmail: "sarah.j@codedream.org",
    });
  }, []);

  if (!user) return <p className="p-4">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8">
      {/* Header Section */}
      <div className="w-full max-w-4xl bg-[#1E2B3A] text-white rounded-xl shadow-lg p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 bg-gray-300 rounded-md flex items-center justify-center">
          <span className="text-gray-500">📷</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-lg">{user.name}</p>
          <p className="text-sm">{user.email}</p>
        </div>
      </div>

      {/* Session Stats Card */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4">Session Stats</h2>
        <p>Total Sessions Attended: {user.sessionsAttended}</p>
        <p>Sessions This Week: {user.sessionsThisWeek}</p>
        <p>Upcoming Sessions: {user.upcomingSessions}</p>
        <button
          className="mt-4 px-4 py-2 bg-green-200 hover:bg-green-300 text-sm rounded-md"
          onClick={() => alert("Manage Sessions clicked")}
        >
          Manage Sessions
        </button>
      </div>

      {/* Homework Reviewer Card */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6 mt-6">
        <h2 className="text-lg font-semibold mb-2">Homework Reviewer</h2>
        <p className="text-sm">
          Contact Information:
          <br />
          {user.reviewerName}
          <br />
          {user.reviewerEmail}
        </p>
        <button
          className="mt-4 px-4 py-2 bg-green-200 hover:bg-green-300 text-sm rounded-md"
          onClick={() =>
            (window.location.href = `mailto:${user.reviewerEmail}`)
          }
        >
          Email Reviewer
        </button>
      </div>

      {/* Edit Profile Button */}
      <button
        className="mt-6 px-6 py-2 bg-green-200 hover:bg-green-300 rounded-md"
        onClick={() => alert("Edit Profile clicked")}
      >
        Edit Profile
      </button>
    </div>
  );
}