import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

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
      <div className="app-header">
        <div className="app-header__avatar">
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

        <div className="app-header__content">
          <h1 className="app-header__title">My Profile</h1>
          {isEditing ? (
            <div className="w-full space-y-3 mt-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full text-black p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full text-black p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
              {/* File input for profile image */}
              <div className="w-full">
                <label className="block text-sm font-medium text-white mb-2">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm text-white bg-white/20 rounded-lg p-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-white file:text-gray-700 hover:file:bg-gray-100"
                />
              </div>
            </div>
          ) : (
            <>
              <p className="app-header__subtitle">{user.name}</p>
              <p className="app-header__description">{user.email}</p>
            </>
          )}
        </div>
      </div>

      {/* Session Stats Card */}
      <div className="info-card">
        <h2 className="card-title">Session Stats</h2>
        <div className="card-content">
          <p>Total Sessions Attended: {user.sessionsAttended}</p>
          <p>Sessions This Week: {user.sessionsThisWeek}</p>
          <p>Upcoming Sessions: {user.upcomingSessions}</p>
          <button onClick={() => navigate("/my-sessions")}>
            Manage Sessions
          </button>
        </div>
      </div>

      {/* Homework Reviewer Card */}
      <div className="info-card">
        <h2 className="card-title">Homework Reviewer</h2>
        <div className="card-content">
          <p>
            Contact Information:
            <br />
            {user.reviewerName}
            <br />
            {user.reviewerEmail}
          </p>
          <button
            onClick={() =>
              (window.location.href = `mailto:${user.reviewerEmail}`)
            }
          >
            Email Reviewer
          </button>
        </div>
      </div>

      {/* Edit/Save Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        {isEditing ? (
          <>
            <button className="btn-blue" onClick={handleSave}>
              Save Changes
            </button>
            <button
              className="btn-light"
              onClick={() => {
                setFormData(user); // reset edits
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button className="btn-green" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
