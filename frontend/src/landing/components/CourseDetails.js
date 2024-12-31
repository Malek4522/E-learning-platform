import React from 'react';
import { useParams } from 'react-router-dom';
import styles from './CourseDetails.module.css'; // Import the CSS module

function CourseDetails({ courses }) {
  const { id } = useParams();
  const course = courses.find(course => course.id === parseInt(id));

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className={styles.courseDetails}>
      <header className={styles.headerImage}>
        <h1>{course.title}</h1>
        <p>{course.description}</p>
      </header>
     
    </div>
  );
}

export default CourseDetails; 