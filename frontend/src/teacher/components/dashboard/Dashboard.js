import React, { useState, useEffect } from "react";
import CourseCard from "./CourseCard";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import useProtectedRequest from "../../../hooks/useProtectedRequest";
import "../../styles/dashboard/dashboard.css";
import logo from "../../assets/images/logo.png";

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { makeRequest, status } = useProtectedRequest('/api/v1/courses', 'GET');

  const fetchCourses = async () => {
    try {
      const response = await makeRequest();
      if (response) {
        // Format courses with required UI properties
        const formattedCourses = response.map(course => ({
          ...course,
          id: course._id,
          thumbnail: logo,
          progress: 0, // You might want to calculate this from actual progress data
          duration: (() => {
            const totalMinutes = course.totalVideoDuration || 0;
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return `${hours}:${minutes.toString().padStart(2, '0')}`;
          })(),
          lessons: course.chapters.reduce((total, chapter) => 
            total + chapter.lessons.length, 0),
          path: `/teacher/course/${course._id}`
        }));
        setCourses(formattedCourses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []); // Empty dependency array since we only want to fetch once on mount

  // Handle course deletion
  const handleCourseDelete = (courseId) => {
    setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
  };

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
            {status.type === 'loading' ? (
              <div className="loading-message">Loading courses...</div>
            ) : status.type === 'error' ? (
              <div className="error-message">
                {status.message || 'Error loading courses'}
              </div>
            ) : filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onDelete={handleCourseDelete}
                />
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
