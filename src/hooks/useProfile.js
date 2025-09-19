import { useState, useEffect } from "react";

/**
 * Generic hook to fetch, edit, and update a user profile
 *
 * @param {string} fetchUrl - API endpoint to fetch the profile
 * @param {string} updateUrlBase - Base API endpoint for updates (e.g., "/api/v1/user")
 * @param {function} mapToFormData - Function to map API data to local form state
 * @param {string} uploadUrl - Optional API endpoint to upload images
 */
export function useProfile(fetchUrl, updateUrlBase, mapToFormData) {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(fetchUrl, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setUser(data.profile);
        setFormData(mapToFormData(data.profile));
      } catch (err) {
        console.error(err);
        alert("Error loading profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [fetchUrl, mapToFormData]);

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

      const res = await fetch(`${updateUrlBase}/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to update profile");

      setUser(data);
      setFormData(mapToFormData(data));
      setIsEditing(false);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert(err.message || "Error updating profile");
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
