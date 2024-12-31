import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./common/Sidebar";
import Header from "./common/Header";
import "../styles/Layout.css";

function Layout() {
  const location = useLocation();

  return (
    <div className="student-app">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
