import React from "react";
import "../styles/HeaderAdmin.css"
import ProfileDropdown from "./ProfileDropdown"

function Header() {
  return (
    <div className="admin-app">
      <div className="header">
        <div className="logo">
          <h1><a href="/">E-Learning</a></h1>
        </div>
        <div className="header-actions">
          <ProfileDropdown />
        </div>
      </div>
    </div>
  );
}

export default Header;
