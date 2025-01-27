import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import styles from './CourseCatalog.module.css';
import logo from '../teacher/assets/images/logo.png';

function CourseCatalog() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/v1/courses/preview');
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch courses. Please try again later.');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleViewDetails = (e, course) => {
    e.preventDefault();
    setSelectedCourse(course);
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    setSelectedCourse(null);
  };

  if (loading) return <div className={styles.loading}>Loading courses...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <>
      <Navbar />
      <div className={styles.courseCatalog}>
        <h1>Available Courses</h1>
        <div className={styles.courseList}>
          {courses.map(course => (
            <div key={course.id} className={styles.courseCard}>
              <img src={logo} alt={course.title} />
              <div className={styles.courseInfo}>
                <h2>{course.title}</h2>
                <p>{course.description}</p>
                <div className={styles.courseMeta}>
                  <span><i className="fas fa-book-open"></i> {course.totalLessons} Lessons</span>
                  <span><i className="fas fa-clock"></i> {Math.floor(course.totalDuration / 60)} hours</span>
                </div>
                <div className={styles.categories}>
                  {course.categories.map((category, index) => (
                    <span key={index} className={styles.category}>{category}</span>
                  ))}
                </div>
                <Link to={`/course/${course.id}`} onClick={(e) => handleViewDetails(e, course)}>
                  <button className={styles.enrollButton}>View Details</button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {showAlert && selectedCourse && (
          <div className={styles.alertOverlay} onClick={handleCloseAlert}>
            <div className={styles.alertContent} onClick={e => e.stopPropagation()}>
              <button className={styles.closeButton} onClick={handleCloseAlert}>×</button>
              <h3>{selectedCourse.title}</h3>
              <div className={styles.alertTeacherInfo}>
                <h4>Teacher Information:</h4>
                {selectedCourse.teacher.profile.first_name && (
                  <p><strong>First Name:</strong> {selectedCourse.teacher.profile.first_name}</p>
                )}
                {selectedCourse.teacher.profile.last_name && (
                  <p><strong>Last Name:</strong> {selectedCourse.teacher.profile.last_name}</p>
                )}
                {selectedCourse.teacher.email && (
                  <p><strong>Email:</strong> {selectedCourse.teacher.email}</p>
                )}
                {selectedCourse.teacher.profile.bio && (
                  <div className={styles.teacherBio}>
                    <strong>Bio:</strong>
                    <p>{selectedCourse.teacher.profile.bio}</p>
                  </div>
                )}
              </div>
              <div className={styles.alertChapters}>
                <h4>Course Chapters:</h4>
                <ul>
                  {selectedCourse.chapterTitles.map((chapter, index) => (
                    <li key={index}>{chapter}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CourseCatalog;