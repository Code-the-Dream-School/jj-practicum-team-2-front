import React from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";

// API endpoints
const FETCH_URL = "http://localhost:8000/api/v1/user/myProfile";
const UPDATE_URL = "http://localhost:8000/api/v1/user";

// Normalize backend profile into formData
const mapToFormData = (profile) => ({
  name: `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
  email: profile.email || "",
  avatarUrl: profile.avatarUrl || "", // use avatarUrl consistently
  bio: profile.bio || "",
  zoomLink: profile.zoomLink || "",
  sessionsCreated: profile.sessionsCreated || 0,
  sessionsThisWeek: profile.sessionsThisWeek || 0,
  upcomingSessions: profile.upcomingSessions || 0,
  averageAttendance: profile.averageAttendance || 0,
});

export default function MentorProfile() {
  const navigate = useNavigate();

  const {
    user,
    formData,
    loading,
    isEditing,
    setIsEditing,
    handleChange,
    handleSave,
    setFormData,
  } = useProfile(FETCH_URL, UPDATE_URL, mapToFormData);

  if (loading) return <p className="p-4">Loading profile...</p>;
  if (!user) return <p className="p-4">No profile found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8">
      {/* Header Section */}
      <div className="w-full max-w-4xl bg-[#1E2B3A] text-white rounded-xl shadow-lg p-6 flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="w-24 h-24 bg-gray-300 rounded-md flex items-center justify-center overflow-hidden">
          {formData.avatarUrl ? (
            <img
              src={formData.avatarUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500">📷</span>
          )}
        </div>

        {/* Profile Info */}
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
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Enter your bio"
                className="text-black p-2 rounded w-full mt-2 h-24"
              />
              <input
                type="text"
                name="zoomLink"
                value={formData.zoomLink}
                onChange={handleChange}
                placeholder="Enter Zoom link"
                className="text-black p-1 rounded w-full mt-2"
              />
              {/* Avatar URL input */}
              <input
                type="text"
                name="avatarUrl"
                value={formData.avatarUrl || ""}
                onChange={handleChange}
                placeholder="Enter image URL"
                className="text-black p-1 rounded w-full mt-2"
              />
            </>
          ) : (
            <>
              <p className="text-lg font-semibold">{formData.name}</p>
              <p className="text-sm">{formData.email}</p>
              {formData.bio && (
                <p className="mt-2 text-gray-200">{formData.bio}</p>
              )}
              {formData.zoomLink && (
                <p className="mt-1">
                  <span className="font-semibold">🔗 Zoom Link:</span>{" "}
                  <a
                    href={formData.zoomLink}
                    className="text-blue-400 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {formData.zoomLink}
                  </a>
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Session Stats */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4">Session Stats</h2>
        <p>Total Sessions Created: {formData.sessionsCreated}</p>
        <p>Sessions This Week: {formData.sessionsThisWeek}</p>
        <p>Upcoming Sessions: {formData.upcomingSessions}</p>
        <p>Average Attendance: {formData.averageAttendance}</p>
        <button
          className="mt-4 px-4 py-2 bg-green-200 hover:bg-green-300 text-sm rounded-md"
          onClick={() => navigate("/manage-sessions")}
        >
          Manage Sessions
        </button>
      </div>

      {/* Edit Profile Buttons */}
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
                setFormData(mapToFormData(user));
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
