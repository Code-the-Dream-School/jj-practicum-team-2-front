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
      <div className="mt-6 flex gap-4">
        {isEditing ? (
          <>
            <button className="btn-blue px-6" onClick={handleSave}>
              Save
            </button>
            <button
              className="btn-light px-6"
              onClick={() => {
                setFormData(user); // reset edits
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button className="btn-green px-6" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
