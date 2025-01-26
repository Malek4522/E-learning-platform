import React from 'react';
import { Link } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import '../../styles/common/Header.css';

function Header() {
  return (
    <div className="student-app">
      <header className="main-header">
        <div className="header-left">
          <Link to="/student/dashboard">
            <h1>E-Learning</h1>
          </Link>
        </div>
        <div className="header-center">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search courses, students..." />
          </div>
        </div>
        <div className="header-right">
          <ProfileDropdown />
        </div>
      </header>
    </div>
  );
}

export default Header;
