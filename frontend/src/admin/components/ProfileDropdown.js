import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/ProfileDropdown.css';
import useLogout from '../../hooks/useLogout';

function ProfileDropdown() {
  const { logout, status } = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const admin = {
    firstName: 'Profile',
    lastName: '',
    email: '',
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="admin-app">
      <div className="profile-dropdown" ref={dropdownRef}>
        <div className="profile-trigger" onClick={() => setIsOpen(!isOpen)}>
          Profile
          <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
        </div>

        {isOpen && (
          <div className="dropdown-menu">
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
              <button 
                className="dropdown-item logout" 
                onClick={handleLogout}
                disabled={status.type === 'loading'}
              >
                <i className="fas fa-sign-out-alt"></i>
                {status.type === 'loading' ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        )}
      </div>
      {status.type === 'error' && (
        <div className="error-message">
          {status.message}
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown; 