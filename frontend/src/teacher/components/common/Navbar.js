import React from 'react';
import { Link } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import SearchBar from './SearchBar';
import '../../styles/common/navbar.css';

function Navbar() {
  console.log("Navbar is rendering");
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">
          <h1>E-Learning</h1>
        </Link>
      </div>

      <div className="navbar-search">
        <SearchBar />
      </div>

      <div className="navbar-actions">
        <ProfileDropdown />
      </div>
    </nav>
  );
}

export default Navbar; 