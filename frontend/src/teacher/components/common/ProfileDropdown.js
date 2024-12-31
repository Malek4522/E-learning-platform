import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/common/profileDropdown.css';

function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const instructor = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
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

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button 
        className="profile-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img 
          src={instructor.profileImage || "https://via.placeholder.com/40"} 
          alt="Profile" 
          className="profile-avatar"
        />
        <span className="profile-name">{instructor.firstName}</span>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <img 
              src={instructor.profileImage || "https://via.placeholder.com/60"} 
              alt="Profile" 
              className="header-avatar"
            />
            <div className="header-info">
              <h4>{`${instructor.firstName} ${instructor.lastName}`}</h4>
              <p>{instructor.email}</p>
            </div>
          </div>

          <div className="dropdown-content">
            <Link to="/teacher/profile" className="dropdown-item">
              <i className="fas fa-user"></i>
              My Profile
            </Link>
            <Link to="/teacher/settings" className="dropdown-item">
              <i className="fas fa-cog"></i>
              Settings
            </Link>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item logout">
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown; 