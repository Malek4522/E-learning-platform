import React, { useState, useEffect } from "react";
import useProtectedRequest from "../../hooks/useProtectedRequest";
import "../styles/pages/Profile.css";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    level: "1st Year",
    specialization: "LMD Security",
    address: "",
  });

  // Fetch profile data
  const { data: profileData, status: fetchStatus } = useProtectedRequest("/api/v1/users/profile");

  // For updates, we'll use the hook with null requestData initially
  const { status: updateStatus, makeRequest: updateProfile } = useProtectedRequest(
    "/api/v1/users/profile",
    "PUT"
  );

  // Initialize form data when profile is fetched
  useEffect(() => {
    if (profileData?.profile) {
      setFormData({
        firstName: profileData.profile.first_name || "",
        lastName: profileData.profile.last_name || "",
        email: profileData.email || "",
        level: profileData.level || "1st Year",
        specialization: profileData.specialization || "LMD Security",
        address: profileData.address || "algeria blida",
      });
    }
  }, [profileData]);

  // Watch for update completion
  useEffect(() => {
    if (updateStatus.type === 'success') {
      setIsEditing(false);
      alert("Profile updated successfully!");
    } else if (updateStatus.type === 'error') {
      alert(`Failed to update profile: ${updateStatus.message}`);
    }
  }, [updateStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const updateData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      bio: formData.bio,
      profile_picture: formData.profile_picture,
      email: formData.email,
      level: formData.level,
      specialization: formData.specialization,
      address: formData.address
    };

    // Call makeRequest with the update data
    updateProfile(updateData);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleSubmit();
    } else {
      setIsEditing(true);
    }
  };

  if (fetchStatus.type === "error") {
    return <div className="error-message">Failed to load profile: {fetchStatus.message}</div>;
  }

  if (!profileData) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="student-app">
      <div className="profile-page">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-initials">
              {formData.firstName[0]}
              {formData.lastName[0]}
            </div>
          </div>
          <div className="profile-info">
            <h1>
              {formData.firstName} {formData.lastName}
            </h1>
            <p>
              {formData.level} - {formData.specialization}
            </p>
          </div>
          <button
            className={`profile-btn ${isEditing ? "done-btn" : "edit-btn"}`}
            onClick={handleEditToggle}
          >
            {isEditing ? "Done" : "Edit Profile"}
          </button>
        </div>

        <form className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                {isEditing && <i className="fas fa-pencil-alt edit-icon"></i>}
              </div>
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                {isEditing && <i className="fas fa-pencil-alt edit-icon"></i>}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <div className="input-with-icon">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                {isEditing && <i className="fas fa-pencil-alt edit-icon"></i>}
              </div>
            </div>
            <div className="form-group">
              <label>Level</label>
              <div className="input-with-icon">
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="Master 1">Master 1</option>
                  <option value="Master 2">Master 2</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Specialization</label>
              <div className="input-with-icon">
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                >
                  <option value="LMD Security">LMD Security</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Networks">Networks</option>
                  <option value="AI">AI & Machine Learning</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Address</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                {isEditing && <i className="fas fa-pencil-alt edit-icon"></i>}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
