import React from "react";
import "../styles/HeaderAdmin.css"
import ProfileDropdown from "./ProfileDropdown"

function Header() {
  return (
    <div className="admin-app">
      <div className="header">
        <div className="logo">
          <h1>E-Learning</h1>
        </div>
        <div className="header-actions">
          <button className="notification-btn">
            <i className="fas fa-bell"></i>
            <span className="notification-badge">3</span>
          </button>
          <ProfileDropdown />
        </div>
      </div>
    </div>
  );
}

export default Header;
