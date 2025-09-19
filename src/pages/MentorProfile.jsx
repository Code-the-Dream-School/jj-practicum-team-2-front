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
  avatarUrl: profile.avatarUrl || "",
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
      {/* Header */}
      <div className="app-header">
        <div className="app-header__avatar">
          {formData.avatarUrl ? (
            <img
              src={formData.avatarUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500 text-3xl">📷</span>
          )}
        </div>

        <div className="app-header__content">
          <h1 className="app-header__title">My Profile</h1>
          <p className="app-header__subtitle">{formData.name}</p>
          <p className="text-sm opacity-90">{formData.email}</p>
        </div>
      </div>

      {/* Bio / Zoom / Image (edit section) */}
      <div className="info-card">
        <h2 className="card-title">About Me</h2>
        <div className="card-content">
          {isEditing ? (
            <>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Enter your bio"
                className="text-black p-2 rounded w-full h-24"
              />
              <input
                type="text"
                name="zoomLink"
                value={formData.zoomLink}
                onChange={handleChange}
                placeholder="Enter Zoom link"
                className="text-black p-2 rounded w-full mt-2"
              />
              <input
                type="text"
                name="avatarUrl"
                value={formData.avatarUrl || ""}
                onChange={handleChange}
                placeholder="Enter image URL"
                className="text-black p-2 rounded w-full mt-2"
              />
            </>
          ) : (
            <>
              {formData.bio && <p>{formData.bio}</p>}
              {formData.zoomLink && (
                <p className="mt-2">
                  <span className="font-semibold">🎥 Default Zoom Link:</span>{" "}
                  <a
                    href={formData.zoomLink}
                    className="text-accent underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {formData.zoomLink}
                  </a>
                </p>
              )}
              {formData.avatarUrl && (
                <p className="mt-2 text-sm text-gray-600">
                  📷 Custom image linked
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Session Stats */}
      <div className="info-card">
        <h2 className="card-title">Session Stats</h2>
        <div className="card-content">
          <p>Total Sessions Created: {formData.sessionsCreated}</p>
          <p>Sessions This Week: {formData.sessionsThisWeek}</p>
          <p>Upcoming Sessions: {formData.upcomingSessions}</p>
          <p>Average Attendance: {formData.averageAttendance}</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/manage-sessions")}
          >
            Manage Sessions
          </button>
        </div>
      </div>

      {/* Edit / Save Buttons */}
      <div className="mt-6 flex gap-4">
        {isEditing ? (
          <>
            <button className="btn btn-blue" onClick={handleSave}>
              Save
            </button>
            <button
              className="btn btn-secondary"
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
            className="btn btn-green"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
