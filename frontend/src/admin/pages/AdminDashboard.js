import React, { useState, useEffect } from "react"; 
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StudentTable from "../components/StudentTable";
import CourseTable from "../components/CourseTable";
import InstructorTable from "../components/InstructorTable";
import Dashboard from "../components/Dashboard";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [currentSection, setCurrentSection] = useState("dashboard");
  const location = useLocation();

  useEffect(() => {
    if (location.state?.section) {
      setCurrentSection(location.state.section);
    }
  }, [location]);

  const renderContent = () => {
    switch(currentSection) {
      case "dashboard":
        return <Dashboard />;
      case "students":
        return <StudentTable />;
      case "instructors":
        return <InstructorTable />;
      case "courses":
        return <CourseTable />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="admin-app">
      <div className="dashboard">
        <Sidebar />
        <div className="main-content">
          <Header />
          <div className="content">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
