import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/dashboard/courseCard.css";

function CourseCard({ course }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/teacher/course/${course.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent card click when clicking delete
    if (window.confirm('Are you sure you want to delete this course?')) {
      const courses = JSON.parse(localStorage.getItem("courses")) || [];
      const updatedCourses = courses.filter(c => c.id !== course.id);
      localStorage.setItem("courses", JSON.stringify(updatedCourses));
      window.location.reload(); // Refresh to show updated list
    }
  };

  return (
    <div className="course-card" onClick={handleClick}>
      <div className="course-thumbnail">
        <img src={course.thumbnail} alt={course.title} />
        <div className="course-overlay">
          <span className="course-lessons">
            <i className="fas fa-book-open"></i> {course.lessons} Lessons
          </span>
          <span className="course-duration">
            <i className="fas fa-clock"></i> {course.duration}h
          </span>
          <button className="delete-course-btn" onClick={handleDelete}>
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div className="course-content">
        <h3>{course.title}</h3>
        <div className="course-footer">
          <div className="course-progress">
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${course.progress || 0}%` }}
              ></div>
            </div>
            <span>{course.progress || 0}% Complete</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
