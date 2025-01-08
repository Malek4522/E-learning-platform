import React from "react";
import { useNavigate } from "react-router-dom";
import useProtectedRequest from "../../../hooks/useProtectedRequest";
import "../../styles/dashboard/courseCard.css";

function CourseCard({ course, onDelete }) {
  const navigate = useNavigate();
  const { makeRequest, status } = useProtectedRequest(`/api/v1/courses/${course.id}`, 'DELETE');

  const handleClick = () => {
    navigate(`/teacher/course/${course.id}`);
  };

  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent card click when clicking delete
    
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const response = await makeRequest();
        if (response) {
          // If deletion was successful, trigger parent update
          onDelete(course.id);
        }
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course. Please try again.');
      }
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
          <button 
            className="delete-course-btn" 
            onClick={handleDelete}
            disabled={status.type === 'loading'}
          >
            <i className={`fas ${status.type === 'loading' ? 'fa-spinner fa-spin' : 'fa-trash'}`}></i>
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
      {status.type === 'error' && (
        <div className="error-tooltip">
          {status.message || 'Error deleting course'}
        </div>
      )}
    </div>
  );
}

export default CourseCard;
