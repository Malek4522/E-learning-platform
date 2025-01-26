import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import '../styles/Layout.css';

function Layout() {
  return (
    <div className="admin-layout">
      <Header />
      <div className="admin-container">
        <Sidebar />
        <div className="admin-main">
          <div className="admin-content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout; 