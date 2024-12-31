import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/common/navbar.css';

function Header() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          TutorTrek
        </Link>
      </div>
      <div className="navbar-right">
        <div className="profile-section">
          <span className="user-name">John Doe</span>
          <div className="profile-image">
            <img src="https://via.placeholder.com/40" alt="Profile" />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header; 