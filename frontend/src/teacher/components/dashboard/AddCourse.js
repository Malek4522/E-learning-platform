import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import '../../styles/dashboard/addCourse.css';
import logo from "../../assets/images/logo.png";

function AddCourse() {
  const navigate = useNavigate();
  
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    instructor: {
      id: '1',
      name: 'John Doe'
    },
    targetAudience: '',
    enrollmentKey: '',
    thumbnail: logo,
    lessons: 0,
    duration: 0,
    progress: 0,
    chapters: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name === 'courseInfo' ? 'description' : name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newCourse = {
      id: Date.now(),
      ...courseData,
      title: courseData.title,
      description: courseData.description,
      thumbnail: logo,
      lessons: 0,
      duration: 15,
      progress: 0,
      chapters: [],
      path: `/teacher/course/${Date.now()}`
    };

    const existingCourses = JSON.parse(localStorage.getItem('courses')) || [];
    const updatedCourses = [...existingCourses, newCourse];
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    
    navigate('/teacher/my-courses');
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <main className="dashboard-content">
          <div className="add-course-container">
            <form onSubmit={handleSubmit} className="course-form">
              <h2>Course Information</h2>
              <div className="form-group">
                <label>Course Title</label>
                <input
                  type="text"
                  name="title"
                  value={courseData.title}
                  onChange={handleInputChange}
                  placeholder="Enter the course title"
                  required
                />
              </div>

              <div className="form-group">
                <label>Target Audience</label>
                <input
                  type="text"
                  name="targetAudience"
                  value={courseData.targetAudience}
                  onChange={handleInputChange}
                  placeholder="Specify who this course is for"
                  required
                />
              </div>

              <div className="form-group">
                <label>Enrollment Key</label>
                <input
                  type="text"
                  name="enrollmentKey"
                  value={courseData.enrollmentKey}
                  onChange={handleInputChange}
                  placeholder="Create an enrollment key for students"
                  required
                />
              </div>

              <div className="form-group">
                <label>Course Description</label>
                <textarea
                  name="description"
                  value={courseData.description}
                  onChange={handleInputChange}
                  placeholder="Enter detailed course description"
                  rows="4"
                  required
                />
              </div>

              <button type="submit" className="submit-btn">
                Create Course
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AddCourse;