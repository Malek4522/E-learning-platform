import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CourseCard.module.css'; // Import the CSS module

function CourseCard({ course }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/course/${course.id}`);
  };

  return (
    <div className={styles.courseCard} onClick={handleClick}>
      <div className={styles.courseThumbnail}>
        <img src={course.thumbnail} alt={course.title} />
        <div className={styles.courseOverlay}>
          <span className={styles.courseLessons}>
            <i className="fas fa-book-open"></i> {course.lessons} Lessons
          </span>
          <span className={styles.courseDuration}>
            <i className="fas fa-clock"></i> {course.duration}h
          </span>
        </div>
      </div>
      <div className={styles.courseContent}>
        <h3>{course.title}</h3>
        <div className={styles.courseFooter}>
          <div className={styles.courseProgress}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progress} 
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
