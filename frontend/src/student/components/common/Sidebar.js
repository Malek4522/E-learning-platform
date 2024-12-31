import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdSchool,
  MdAssignment,
  MdGrade,
} from "react-icons/md";
import "../../styles/common/Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Update navigation to use actual routes instead of state
  const handleNavigation = (path) => {
    if (path === "dashboard") {
      navigate("/student");
    } else {
      navigate(`/student/${path}`);
    }
  };

  // Get active section from URL path
  const getActiveSection = () => {
    const path = location.pathname;
    if (path === "/student") {
      return "dashboard";
    } else if (path.includes("/student/courses")) {
      return "courses";
    } else if (path.includes("/student/assignments")) {
      return "assignments";
    } else if (path.includes("/student/grades")) {
      return "grades";
    } else if (path.includes("/student/profile")) {
      return "profile";
    }
    return "dashboard";
  };

  const currentSection = getActiveSection();

  return (
    <div className="student-app">
      <div className="sidebar">
        <ul className="menu">
          <li
            className={`sidebar-item ${
              currentSection === "dashboard" ? "active" : ""
            }`}
            onClick={() => handleNavigation("dashboard")}
          >
            <MdDashboard className="sidebar-icon" />
            <span>Dashboard</span>
          </li>
          <li
            className={`sidebar-item ${
              currentSection === "courses" ? "active" : ""
            }`}
            onClick={() => handleNavigation("courses")}
          >
            <MdSchool className="sidebar-icon" />
            <span>My Courses</span>
          </li>
          {/* <li
            className={`sidebar-item ${
              currentSection === "assignments" ? "active" : ""
            }`}
            onClick={() => handleNavigation("assignments")}
          >
            <MdAssignment className="sidebar-icon" />
            <span>Assignments</span>
          </li> */}
          <li
            className={`sidebar-item ${
              currentSection === "grades" ? "active" : ""
            }`}
            onClick={() => handleNavigation("grades")}
          >
            <MdGrade className="sidebar-icon" />
            <span>Grades</span>
          </li>
          <li
            className={`sidebar-item ${
              currentSection === "profile" ? "active" : ""
            }`}
            onClick={() => handleNavigation("profile")}
          >
            <MdPeople className="sidebar-icon" />
            <span>Profile</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
