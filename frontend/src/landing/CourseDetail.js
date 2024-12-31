import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './CourseDetail.module.css'; // Import the CSS module

function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Mock course data - replace with actual data fetching logic
  const course = {
    id: courseId,
    title: "Course Title",
    instructor: "Instructor Name",
    targetAudience: "Target Audience",
    description: "Detailed course description goes here."
  };

  const handleEnrollClick = () => {
    // Check if the user is signed in
    const user = localStorage.getItem('user');
    if (!user) {
      // Redirect to login page if not signed in
      navigate('/login', { state: { from: `/course/${courseId}/details` } });
    } else {
      // Proceed with enrollment logic
      navigate(`/course/${courseId}/dashboard`);
    }
  };

  return (
    <div className={styles.courseDetailContainer}>
      <h1>{course.title}</h1>
      <p className={styles.instructor}>Instructor: {course.instructor}</p>
      <p className={styles.targetAudience}>Target Audience: {course.targetAudience}</p>
      <p className={styles.description}>{course.description}</p>
      <button className={styles.enrollButton} onClick={handleEnrollClick}>
        Enroll Now
      </button>
    </div>
  );
}

export default CourseDetail;
