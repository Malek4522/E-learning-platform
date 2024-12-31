import React, { useState, useEffect } from "react";
import CourseCard from "./CourseCard";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import "../../styles/dashboard/dashboard.css";
import logo from "../../assets/images/logo.png";

// Move defaultCourses outside the component
const defaultCourses = [
  {
    id: 1,
    title: "Basic to Advance Figma",
    lessons: 20,
    duration: 15,
    thumbnail: logo,
    progress: 75,
    path: "/teacher/course/1",
  },
  {
    id: 2,
    title: "React JS Basic to Advance",
    lessons: 25,
    duration: 20,
    thumbnail: logo,
    progress: 45,
    path: "/teacher/course/2",
  },
  {
    id: 3,
    title: "Mastering JS with Laravel",
    lessons: 30,
    duration: 25,
    thumbnail: logo,
    progress: 60,
    path: "/teacher/course/3",
  },
];

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load courses from localStorage, if none exist use default courses
    const savedCourses = JSON.parse(localStorage.getItem("courses")) || defaultCourses;
    
    // Ensure all courses have the proper styling properties
    const formattedCourses = savedCourses.map(course => ({
      ...course,
      thumbnail: course.thumbnail || logo,
      progress: course.progress || 0,
      duration: course.duration || 0,
      lessons: course.lessons?.length || 0,
      path: `/teacher/course/${course.id}`
    }));
    
    setCourses(formattedCourses);
  }, []); // Empty dependency array is fine now since defaultCourses is constant

  // Filter courses based on search term
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <main className="dashboard-content">
          <div className="students-header">
            <h1>My Courses</h1>
            <div className="header-actions">
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Search courses..." 
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <i className="fas fa-search"></i>
              </div>
            </div>
          </div>
          <div className="courses-grid">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <div className="no-results">
                <i className="fas fa-search"></i>
                <p>No courses found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
