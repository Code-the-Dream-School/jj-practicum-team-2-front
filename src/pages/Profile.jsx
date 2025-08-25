import { useState, useEffect } from "react";
import React from "react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // TODO: Replace with your real API call
    const fakeUser = {
      name: "John Doe",
      email: "john.doe@example.com",
      sessionsAttended: 12,
      sessionsThisWeek: 2,
      upcomingSessions: 1,
      reviewerName: "Sarah Johnson",
      reviewerEmail: "sarah.j@codedream.org",
      profileImage: null, // default: none
    };
    setUser(fakeUser);
    setFormData(fakeUser);
  }, []);

  if (!user) return <p className="p-4">Loading profile...</p>;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // preview immediately
      const imageUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        profileImage: imageUrl,
      });
      // TODO: for real apps, upload file -> server -> save returned URL
    }
  };

  const handleSave = () => {
    // TODO: Replace with API call (PUT/PATCH)
    setUser(formData);
    setIsEditing(false);
    alert("Profile updated!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8">
      {/* Header Section */}
      <div className="w-full max-w-4xl bg-[#1E2B3A] text-white rounded-xl shadow-lg p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 bg-gray-300 rounded-md flex items-center justify-center overflow-hidden">
          {formData.profileImage ? (
            <img
              src={formData.profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500">📷</span>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">My Profile</h1>
          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="text-black p-1 rounded w-full mt-2"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="text-black p-1 rounded w-full mt-2"
              />
              {/* File input for profile image */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2 text-sm text-white"
              />
            </>
          ) : (
            <>
              <p className="text-lg">{user.name}</p>
              <p className="text-sm">{user.email}</p>
            </>
          )}
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
          onClick={() => (window.location.href = `mailto:${user.reviewerEmail}`)}
        >
          Email Reviewer
        </button>
      </div>

      {/* Edit/Save Buttons */}
      <div className="mt-6 flex gap-4">
        {isEditing ? (
          <>
            <button
              className="px-6 py-2 bg-blue-200 hover:bg-blue-300 rounded-md"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
              onClick={() => {
                setFormData(user); // reset edits
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            className="px-6 py-2 bg-green-200 hover:bg-green-300 rounded-md"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}