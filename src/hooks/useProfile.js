import { useState, useEffect } from "react";
import { profileAPI } from "../services/api";

/**
 * Generic hook to fetch, edit, and update a user profile
 * Now uses profileAPI with correct base URL for production
 */
export function useProfile(mapToFormData) {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileAPI.getProfile();
        setUser(data.profile);
        setFormData(mapToFormData(data.profile));
      } catch (err) {
        console.error("Failed to load profile:", err);
        alert("Error loading profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [mapToFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updates = {
        firstName: formData.name.split(" ")[0] || "",
        lastName: formData.name.split(" ")[1] || "",
        avatarUrl: formData.avatarUrl || null,
        bio: formData.bio || "",
        zoomLink: formData.zoomLink || "",
      };

      const data = await profileAPI.updateProfile(user._id, updates);
      setUser(data.user);
      setFormData(mapToFormData(data.user));
      setIsEditing(false);
      alert("Profile updated!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert(err.response?.data?.error || "Error updating profile");
    }
  };

  return {
    user,
    formData,
    loading,
    isEditing,
    setIsEditing,
    handleChange,
    handleSave,
    setFormData,
  };
}
