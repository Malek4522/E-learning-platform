import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/common/searchBar.css';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState({
    courses: [],
    students: []
  });
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.length > 0) {
      // Get courses from localStorage
      const savedCourses = JSON.parse(localStorage.getItem("courses")) || [];
      // Get students from localStorage
      const savedStudents = JSON.parse(localStorage.getItem("students")) || [];
      
      // Filter courses based on search term
      const filteredCourses = savedCourses.filter(course =>
        course.title.toLowerCase().includes(term)
      );

      // Filter students based on search term
      const filteredStudents = savedStudents.filter(student =>
        student.name?.toLowerCase().includes(term) ||
        student.email?.toLowerCase().includes(term) ||
        student.enrolledCourses?.some(course => 
          course.title.toLowerCase().includes(term)
        )
      );

      setSearchResults({
        courses: filteredCourses,
        students: filteredStudents
      });
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleResultClick = (item, type) => {
    setShowResults(false);
    setSearchTerm('');
    
    if (type === 'course') {
      navigate(`/teacher/course/${item.id}`);
    } else if (type === 'student') {
      navigate(`/teacher/student/${item.id}`);
    }
  };

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-input-wrapper">
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder="Search courses, students..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {showResults && (
        <div className="search-results">
          {searchResults.courses.length > 0 && (
            <div className="result-section">
              <h3>Courses</h3>
              {searchResults.courses.map(course => (
                <div 
                  key={course.id} 
                  className="result-item"
                  onClick={() => handleResultClick(course, 'course')}
                >
                  <i className="fas fa-book"></i>
                  <div className="result-info">
                    <span className="result-title">{course.title}</span>
                    <div className="result-meta">
                      <span>
                        <i className="fas fa-book-open"></i> 
                        {course.lessons?.length || 0} Lessons
                      </span>
                      <span>
                        <i className="fas fa-clock"></i> 
                        {course.duration || 0}h
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchResults.students.length > 0 && (
            <div className="result-section">
              <h3>Students</h3>
              {searchResults.students.map(student => (
                <div 
                  key={student.id} 
                  className="result-item"
                  onClick={() => handleResultClick(student, 'student')}
                >
                  <i className="fas fa-user"></i>
                  <div className="result-info">
                    <span className="result-title">{student.name}</span>
                    <div className="result-meta">
                      <span>{student.email}</span>
                      {student.enrolledCourses && (
                        <span>
                          <i className="fas fa-book"></i> 
                          {student.enrolledCourses.length} Courses
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {searchResults.courses.length === 0 && searchResults.students.length === 0 && (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <p>No results found for "{searchTerm}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar; 