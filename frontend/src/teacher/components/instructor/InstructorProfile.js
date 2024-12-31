import React, { useState } from 'react';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import '../../styles/instructor/instructorProfile.css';

function InstructorProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [instructorData, setInstructorData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    domain: 'Computer Science',
    grade: 'Professor',
    address: '123 University Street, City',
    profileImage: null
  });

  const handleInputChange = (e) => {
    if (!isEditing) return;
    const { name, value } = e.target;
    setInstructorData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile updated:', instructorData);
    setIsEditing(false);
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <main className="dashboard-content">
          <div className="profile-container">
            <div className="profile-header">
              <div className="profile-image-container">
                <img 
                  src={instructorData.profileImage || `https://ui-avatars.com/api/?name=${instructorData.firstName}+${instructorData.lastName}`} 
                  alt="Profile" 
                  className="profile-image"
                />
                {isEditing && (
                  <label className="image-upload-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setInstructorData(prev => ({
                            ...prev,
                            profileImage: URL.createObjectURL(file)
                          }));
                        }
                      }}
                      className="image-upload"
                    />
                    <i className="fas fa-camera"></i>
                  </label>
                )}
              </div>
              <div className="profile-info">
                <h1>{`${instructorData.firstName} ${instructorData.lastName}`}</h1>
                <p className="profile-role">{instructorData.domain} - {instructorData.grade}</p>
              </div>
              <button 
                className="edit-profile-btn"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={instructorData.firstName}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={instructorData.lastName}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={instructorData.email}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>Domain</label>
                  <input
                    type="text"
                    name="domain"
                    value={instructorData.domain}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>Grade</label>
                  <input
                    type="text"
                    name="grade"
                    value={instructorData.grade}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={instructorData.address}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="form-actions">
                  <button type="submit" className="save-profile-btn">
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default InstructorProfile; 