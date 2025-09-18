import { useNavigate } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";

// API endpoints
const FETCH_URL = "http://localhost:8000/api/v1/user/myProfile";
const UPDATE_URL = "http://localhost:8000/api/v1/user";

// Map backend profile to form state
const mapToFormData = (profile) => ({
  name: `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
  email: profile.email || "",
  avatarUrl: profile.avatarUrl || "", // string URL only
  bio: profile.bio || "",
  zoomLink: profile.zoomLink || "",
  reviewerName: profile.reviewerName || "Sarah Johnson",
  reviewerEmail: profile.reviewerEmail || "sarah.j@codedream.org",
  sessionsAttended: profile.sessionsAttended || 0,
  sessionsThisWeek: profile.sessionsThisWeek || 0,
  upcomingSessions: profile.upcomingSessions || 0,
});

export default function StudentProfile() {
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
      <div className="w-full max-w-4xl bg-[#1E2B3A] text-white rounded-xl shadow-lg p-6 flex flex-col sm:flex-row items-center gap-6">
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
                placeholder="Write something about yourself..."
                className="text-black p-2 rounded w-full mt-2 resize-none"
                rows={4}
              />
              {/* Avatar URL input instead of file upload */}
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
              <p className="text-lg">{formData.name}</p>
              <p className="text-sm">{formData.email}</p>
              <p className="mt-2">{formData.bio}</p>
            </>
          )}
        </div>
      </div>

      {/* Session Stats */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4">Session Stats</h2>
        <p>Total Sessions Attended: {formData.sessionsAttended}</p>
        <p>Sessions This Week: {formData.sessionsThisWeek}</p>
        <p>Upcoming Sessions: {formData.upcomingSessions}</p>
        <button
          className="mt-4 px-4 py-2 bg-green-200 hover:bg-green-300 text-sm rounded-md"
          onClick={() => navigate("/my-sessions")}
        >
          Manage Sessions
        </button>
      </div>

      {/* Reviewer */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6 mt-6">
        <h2 className="text-lg font-semibold mb-2">Homework Reviewer</h2>
        <p className="text-sm">
          Contact Information:
          <br />
          {formData.reviewerName}
          <br />
          {formData.reviewerEmail}
        </p>
        <button
          className="mt-4 px-4 py-2 bg-green-200 hover:bg-green-300 text-sm rounded-md"
          onClick={() =>
            (window.location.href = `mailto:${formData.reviewerEmail}`)
          }
        >
          Email Reviewer
        </button>
      </div>

      {/* Edit / Save Buttons */}
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
                setFormData(mapToFormData(user)); // reset edits
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
