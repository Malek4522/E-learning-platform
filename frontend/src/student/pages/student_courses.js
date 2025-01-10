import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useProtectedRequest from "../../hooks/useProtectedRequest";
import "../styles/StudentCourses.css";

function StudentCourses() {
  const navigate = useNavigate();
  const [searchKey, setSearchKey] = useState("");
  const [courses, setCourses] = useState([]);
  const { makeRequest: enrollCourse, status: enrollStatus } = useProtectedRequest(`/api/v1/users/courses/${searchKey}/enroll`, 'POST');
  const { makeRequest: fetchCourses } = useProtectedRequest('/api/v1/courses/enrolled', 'GET');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await fetchCourses();
      if (response ) {      
        setCourses(response);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      await enrollCourse();
      if (enrollStatus.type === 'success') {
        setSearchKey('');
        // Refresh the courses list after successful enrollment
        await loadCourses();
      }
    } catch (error) {
      console.error('Enrollment failed:', error);
    }
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
                key={course._id || course.id}
                className="course-card"
                onClick={() => handleCourseClick(course._id || course.id)}
              >
                <div className="course-image">
                  <img src={course.thumbnail || `https://placehold.co/400x250?text=${encodeURIComponent(course.title)}`} alt={course.title} />
                  <div className="course-stats">
                    <span>
                      <i className="fas fa-book"></i> {course.chapters?.reduce((total, chapter) => total + chapter.lessons.length, 0) || 0} Lessons
                    </span>
                    <span>
                      <i className="fas fa-clock"></i> {`${String(Math.floor((course.totalVideoDuration || 0) / 60)).padStart(2, '0')}h ${String((course.totalVideoDuration || 0) % 60).padStart(2, '0')}min`}
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
