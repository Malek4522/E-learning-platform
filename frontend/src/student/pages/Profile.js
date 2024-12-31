import React, { useState } from "react";
import "../styles/pages/Profile.css";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@student.com",
    level: "1st Year",
    specialization: "LMD Security",
    address: "123 University Street, City",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      // TODO: Add API call to save changes
      alert("Profile updated successfully!");
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="student-app">
      <div className="profile-page">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-initials">
              {profileData.firstName[0]}
              {profileData.lastName[0]}
            </div>
          </div>
          <div className="profile-info">
            <h1>
              {profileData.firstName} {profileData.lastName}
            </h1>
            <p>
              {profileData.level} - {profileData.specialization}
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
                  value={profileData.firstName}
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
                  value={profileData.lastName}
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
                  value={profileData.email}
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
                  value={profileData.level}
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
                  value={profileData.specialization}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                >
                  <option value="LMD Security">LMD Security</option>
                  <option value="Software Engineering">
                    Software Engineering
                  </option>
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
                  value={profileData.address}
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
