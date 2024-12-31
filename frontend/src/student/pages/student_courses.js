import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StudentCourses.css";

function StudentCourses() {
  const navigate = useNavigate();
  const [searchKey, setSearchKey] = useState("");

  const courses = [
    {
      id: 1,
      title: "React JS Basic to Advance",
      thumbnail: "https://placehold.co/400x250?text=React+Course",
      lessons: 25,
      duration: "20h",
    },
    {
      id: 2,
      title: "Basic to Advance Figma",
      thumbnail: "https://placehold.co/400x250?text=Figma+Course",
      lessons: 20,
      duration: "15h",
    },
    {
      id: 3,
      title: "Mastering JS with Laravel",
      thumbnail: "https://placehold.co/400x250?text=JavaScript",
      lessons: 30,
      duration: "25h",
    },
    {
      id: 4,
      title: "Python Programming",
      thumbnail: "https://placehold.co/400x250?text=Python",
      lessons: 28,
      duration: "22h",
    },
    {
      id: 5,
      title: "UI/UX Design Fundamentals",
      thumbnail: "https://placehold.co/400x250?text=UI/UX",
      lessons: 18,
      duration: "16h",
    },
    {
      id: 6,
      title: "Node.js Backend Development",
      thumbnail: "https://placehold.co/400x250?text=Node.js",
      lessons: 32,
      duration: "28h",
    },
    {
      id: 7,
      title: "Full Stack Web Development",
      thumbnail: "https://placehold.co/400x250?text=Fullstack",
      lessons: 40,
      duration: "35h",
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // ... search logic
  };

  const handleCourseClick = (courseId) => {
    navigate(`/student/courses/${courseId}`);
  };

  return (
    <div className="student-app">
      <div className="courses-page">
        <div className="courses-header">
          <h2>My Courses</h2>
          <div className="courses-actions">
            <div className="enrollment-section">
              <input
                type="text"
                placeholder="Enter course enrollment key"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                className="enrollment-input"
              />
              <button className="enroll-button" onClick={handleSearch}>
                Enroll
              </button>
            </div>
          </div>
        </div>

        <div className="courses-wrapper">
          <div className="courses-grid">
            {courses.map((course) => (
              <div
                key={course.id}
                className="course-card"
                onClick={() => handleCourseClick(course.id)}
              >
                <div className="course-image">
                  <img src={course.thumbnail} alt={course.title} />
                  <div className="course-stats">
                    <span>
                      <i className="fas fa-book"></i> {course.lessons} Lessons
                    </span>
                    <span>
                      <i className="fas fa-clock"></i> {course.duration}
                    </span>
                  </div>
                </div>
                <div className="course-info">
                  <h3>{course.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentCourses;
