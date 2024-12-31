import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import styles from './CourseCatalog.module.css';
import logo from '../teacher/assets/images/logo.png';

function CourseCatalog() {
  const courses = [
    { id: 1, title: "Basic to Advance Figma", description: "Learn the fundamentals of Figma and design.", duration: "15 hours", lessons: 20, thumbnail: logo },
    { id: 2, title: "React JS Basic to Advance", description: "Master React from the ground up.", duration: "20 hours", lessons: 25, thumbnail: logo },
    { id: 3, title: "Mastering JS with Laravel", description: "Build powerful applications with JavaScript and Laravel.", duration: "25 hours", lessons: 30, thumbnail: logo },
    { id: 4, title: "Python for Data Science", description: "Learn Python and its applications in Data Science.", duration: "30 hours", lessons: 35, thumbnail: logo },
    { id: 5, title: "Introduction to Machine Learning", description: "Get started with Machine Learning concepts and techniques.", duration: "40 hours", lessons: 40, thumbnail: logo },
    { id: 6, title: "Web Development with Django", description: "Build robust web applications using Django.", duration: "25 hours", lessons: 28, thumbnail: logo },
  ];

  return (
    <>
      <Navbar />
      <div className={styles.courseCatalog}>
        <h1>Available Courses</h1>
        <div className={styles.courseList}>
          {courses.map(course => (
            <div key={course.id} className={styles.courseCard}>
              <img src={course.thumbnail} alt={course.title} />
              <div className={styles.courseInfo}>
                <h2>{course.title}</h2>
                <p>{course.description}</p>
                <div className={styles.courseMeta}>
                  <span><i className="fas fa-book-open"></i> {course.lessons} Lessons</span>
                  <span><i className="fas fa-clock"></i> {course.duration}</span>
                </div>
                <Link to={`/course/${course.id}`}>
                  <button className={styles.enrollButton}>View Details</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default CourseCatalog;