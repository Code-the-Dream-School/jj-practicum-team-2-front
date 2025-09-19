import { useNavigate } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";

const FETCH_URL = "http://localhost:8000/api/v1/user/myProfile";
const UPDATE_URL = "http://localhost:8000/api/v1/user";

const mapToFormData = (profile) => ({
  name: `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
  email: profile.email || "",
  avatarUrl: profile.avatarUrl || "",
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
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8">
      {/* Header */}
      <div className="app-header">
        <div className="app-header__avatar">
          {formData.avatarUrl ? (
            <img
              src={formData.avatarUrl}
              alt="Profile"
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <span className="text-4xl">👤</span>
          )}
        </div>

        <div className="app-header__content">
          <h1 className="app-header__title">My Profile</h1>
          <p className="app-header__subtitle">{formData.name}</p>
          <p className="text-sm opacity-90">{formData.email}</p>
        </div>
      </div>

      {/* Personal Info */}
      <div className="info-card">
        <h2 className="card-title">About Me</h2>
        <div className="card-content">
          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 mb-2"
                placeholder="Full name"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 mb-2"
                placeholder="Email"
              />
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Write something about yourself..."
                className="w-full border border-gray-300 rounded-md p-2 mb-2 resize-none"
                rows={4}
              />
              <input
                type="text"
                name="avatarUrl"
                value={formData.avatarUrl || ""}
                onChange={handleChange}
                placeholder="Enter image URL"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </>
          ) : (
            <>
              <p className="mt-2">{formData.bio}</p>
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
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{formData.sessionsAttended}</p>
            <p className="text-gray-600 text-sm">Total Attended</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{formData.sessionsThisWeek}</p>
            <p className="text-gray-600 text-sm">This Week</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{formData.upcomingSessions}</p>
            <p className="text-gray-600 text-sm">Upcoming</p>
          </div>
        </div>
        <button
          className="btn btn-primary mt-4"
          onClick={() => navigate("/my-sessions")}
        >
          Manage Sessions
        </button>
      </div>

      {/* Reviewer */}
      <div className="info-card">
        <h2 className="card-title">Homework Reviewer</h2>
        <div className="card-content">
          <p>{formData.reviewerName}</p>
          <p>{formData.reviewerEmail}</p>
          <button
            className="btn btn-primary mt-4"
            onClick={() =>
              (window.location.href = `mailto:${formData.reviewerEmail}`)
            }
          >
            Email Reviewer
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
            className="btn btn-primary"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
