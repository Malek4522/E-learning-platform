import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdSchool,
} from "react-icons/md";
import { GiTeacher } from "react-icons/gi";
import "../styles/SidebarAdmin.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    if (path === "dashboard") {
      navigate("/admin", { state: { section: "dashboard" }});
    } else {
      navigate("/admin", { state: { section: path }});
    }
  };

  const getActiveSection = () => {
    if (location.state?.section) {
      return location.state.section;
    }
    return "dashboard";
  };

  const currentSection = getActiveSection();

  return (
    <div className="admin-app">
      <div className="sidebar">
        <ul className="menu">
          <li
            className={`sidebar-item ${currentSection === "dashboard" ? "active" : ""}`}
            onClick={() => handleNavigation("dashboard")}
          >
            <MdDashboard className="sidebar-icon" />
            <span>Dashboard</span>
          </li>
          <li
            className={`sidebar-item ${currentSection === "students" ? "active" : ""}`}
            onClick={() => handleNavigation("students")}
          >
            <MdPeople className="sidebar-icon" />
            <span>Students</span>
          </li>
          <li
            className={`sidebar-item ${currentSection === "instructors" ? "active" : ""}`}
            onClick={() => handleNavigation("instructors")}
          >
            <GiTeacher className="sidebar-icon instructor-icon" />
            <span>Instructors</span>
          </li>
          <li
            className={`sidebar-item ${currentSection === "courses" ? "active" : ""}`}
            onClick={() => handleNavigation("courses")}
          >
            <MdSchool className="sidebar-icon" />
            <span>Courses</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;

