import React, { useState, useRef } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../styles/AdminProfile.css';

function AdminProfile({ currentSection, setCurrentSection }) {
  const [profileData, setProfileData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@tutortrek.com',
    phone: '+1234567890',
    role: 'Administrator',
    bio: 'Experienced administrator with a focus on educational platform management.',
    profileImage: 'https://via.placeholder.com/150'
  });

  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const handleEdit = (field) => {
    setEditingField(field);
    setTempValue(profileData[field]);
  };

  const handleSave = (field) => {
    setProfileData({ ...profileData, [field]: tempValue });
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handlePhotoClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileData(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select an image file');
    }
  };

  const renderEditableField = (label, field) => {
    const isCurrentlyEditing = editingField === field;

    return (
      <div className="form-group">
        <label>{label}</label>
        <div className="editable-field">
          {isCurrentlyEditing ? (
            <div className="edit-mode">
              <input
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                autoFocus
              />
              <div className="edit-actions">
                <button 
                  className="save-btn" 
                  onClick={() => handleSave(field)}
                >
                  <i className="fas fa-check"></i>
                </button>
                <button 
                  className="cancel-btn" 
                  onClick={handleCancel}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          ) : (
            <div className="view-mode">
              <span>{profileData[field]}</span>
              {isEditing && (
                <button 
                  className="edit-field-btn"
                  onClick={() => handleEdit(field)}
                >
                  <i className="fas fa-pencil-alt"></i>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="admin-app">
      <div className="dashboard">
        <Sidebar 
          currentSection={currentSection} 
          setCurrentSection={setCurrentSection} 
        />
        <div className="main-content">
          <Header />
          <div className="profile-container">
            <div className="profile-header">
              <div className="profile-header-info">
                <div className="profile-image-container">
                  <img
                    src={profileData.profileImage}
                    alt="Profile"
                    className="profile-header-image"
                  />
                  {isEditing && (
                    <>
                      <div className="edit-photo-icon" onClick={handlePhotoClick}>
                        <i className="fas fa-camera"></i>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                        className="photo-input"
                      />
                    </>
                  )}
                </div>
                <h2>{`${profileData.firstName} ${profileData.lastName}`}</h2>
              </div>
              <button 
                className={`edit-profile-btn ${isEditing ? 'save' : ''}`}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Done' : 'Edit Profile'}
              </button>
            </div>

            <div className="profile-content">
              <form className="profile-form">
                <div className="form-row">
                  {renderEditableField('First Name', 'firstName')}
                  {renderEditableField('Last Name', 'lastName')}
                </div>

                <div className="form-row">
                  {renderEditableField('Email', 'email')}
                  {renderEditableField('Phone Number', 'phone')}
                </div>

                <div className="form-group full-width">
                  <label>Role</label>
                  <div className="view-mode">
                    <span>{profileData.role}</span>
                  </div>
                </div>

                <div className="form-group full-width">
                  {renderEditableField('Bio', 'bio')}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile; 