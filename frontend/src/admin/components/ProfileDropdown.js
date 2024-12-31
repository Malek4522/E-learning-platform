import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProfileDropdown.css';

function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const admin = {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@tutortrek.com',
    profileImage: null
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...');
  };

  return (
    <div className="admin-app">
      <div className="profile-dropdown" ref={dropdownRef}>
        <div className="profile-trigger" onClick={() => setIsOpen(!isOpen)}>
          <img
            src={admin.profileImage || "https://via.placeholder.com/40"}
            alt="Profile"
            className="profile-pic"
          />
          <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
        </div>

        {isOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-header">
              <img
                src={admin.profileImage || "https://via.placeholder.com/40"}
                alt="Profile"
                className="dropdown-profile-pic"
              />
              <div className="dropdown-user-info">
                <h4>{`${admin.firstName} ${admin.lastName}`}</h4>
                <p>{admin.email}</p>
              </div>
            </div>

            <div className="dropdown-content">
              <Link to="/admin/profile" className="dropdown-item">
                <i className="fas fa-user"></i>
                My Profile
              </Link>
              <Link to="/admin/settings" className="dropdown-item">
                <i className="fas fa-cog"></i>
                Settings
              </Link>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileDropdown; 