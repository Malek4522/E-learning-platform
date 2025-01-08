import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useProtectedRequest from '../../../hooks/useProtectedRequest';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import '../../styles/dashboard/addCourse.css';

function AddCourse() {
  const navigate = useNavigate();
  const { makeRequest, status } = useProtectedRequest('/api/v1/courses', 'POST');
  
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    key: '',
    categories: ['General'],  // Default category
    chapters: []  // Empty chapters array as it's not required initially
  });

  const [categoriesInput, setCategoriesInput] = useState('General');  // Initialize with default category

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'categories') {
      setCategoriesInput(value);
      // Ensure we always have at least one category
      const categoriesArray = value.split(',')
        .map(cat => cat.trim())
        .filter(cat => cat !== '');
      
      setCourseData(prev => ({
        ...prev,
        categories: categoriesArray.length > 0 ? categoriesArray : ['General']
      }));
    } else {
      setCourseData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await makeRequest(courseData);
      if (response) {
        navigate('/teacher/my-courses');
      }
    } catch (error) {
      console.error('Error creating course:', error);
    }
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
                <label>Course Key</label>
                <input
                  type="text"
                  name="key"
                  value={courseData.key}
                  onChange={handleInputChange}
                  placeholder="Create a unique enrollment key"
                  required
                />
                <small className="input-help">This key will be used by students to enroll in your course</small>
              </div>

              <div className="form-group">
                <label>Categories</label>
                <input
                  type="text"
                  name="categories"
                  value={categoriesInput}
                  onChange={handleInputChange}
                  placeholder="Enter categories separated by commas (e.g., Programming, Web Development)"
                  required
                />
                <small className="input-help">Separate categories with commas (at least one category is required)</small>
                {courseData.categories.length > 0 && (
                  <div className="categories-preview">
                    Current categories: {courseData.categories.join(', ')}
                  </div>
                )}
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

              {status.type === 'error' && (
                <div className="error-message">
                  {status.message}
                </div>
              )}

              <button type="submit" className="submit-btn" disabled={status.type === 'loading'}>
                {status.type === 'loading' ? 'Creating Course...' : 'Create Course'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AddCourse;