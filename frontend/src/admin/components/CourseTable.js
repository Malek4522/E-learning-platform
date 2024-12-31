import React, { useState } from "react";
import Modal from "./Modal";
import "../styles/CourseTable.css";

const CourseTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [courses, setCourses] = useState([
    {
      id: 1,
      name: "Introduction to Programming",
      instructor: "John Doe",
      audience: "Beginners",
      key: "PROG101",
      students: 25
    },
    {
      id: 2,
      name: "Advanced Web Development",
      instructor: "Jane Smith",
      audience: "Intermediate",
      key: "WEB201",
      students: 30
    }
  ]);

  const [newCourse, setNewCourse] = useState({
    name: "",
    instructor: "",
    audience: "",
    key: "",
    students: 0
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      setCourses(prev => 
        prev.map(course => 
          course.id === newCourse.id ? newCourse : course
        )
      );
    } else {
      const id = courses.length + 1;
      setCourses(prev => [...prev, { ...newCourse, id }]);
    }
    handleCloseModal();
  };

  const handleEdit = (course) => {
    setNewCourse(course);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(prev => prev.filter(course => course.id !== id));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setNewCourse({
      name: "",
      instructor: "",
      audience: "",
      key: "",
      students: 0
    });
  };

  const handleAddNew = () => {
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.audience.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-app">
      <div className="course-table-container">
        <div className="course-table-header">
          <div className="header-left">
            <h2>Courses</h2>
            <p>Total Courses: {courses.length}</p>
          </div>
          <div className="action-bar">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <i className="fas fa-search"></i>
            </div>
            <button className="add-btn" onClick={handleAddNew}>
              + Add New Course
            </button>
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={isEditMode ? "Edit Course" : "Add New Course"}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Course Name</label>
              <input
                type="text"
                name="name"
                value={newCourse.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Instructor</label>
              <input
                type="text"
                name="instructor"
                value={newCourse.instructor}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Target Audience</label>
              <select
                name="audience"
                value={newCourse.audience}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Audience</option>
                <option value="Beginners">Beginners</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div className="form-group">
              <label>Course Key</label>
              <input
                type="text"
                name="key"
                value={newCourse.key}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Number of Students</label>
              <input
                type="number"
                name="students"
                value={newCourse.students}
                onChange={handleInputChange}
                required
                min="0"
              />
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                {isEditMode ? 'Update Course' : 'Add Course'}
              </button>
            </div>
          </form>
        </Modal>

        <table className="course-table">
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Instructor</th>
              <th>Target Audience</th>
              <th>Course Key</th>
              <th># Students</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course) => (
              <tr key={course.id}>
                <td>{course.name}</td>
                <td>{course.instructor}</td>
                <td>{course.audience}</td>
                <td>{course.key}</td>
                <td>{course.students}</td>
                <td className="actions-cell">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(course)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(course.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseTable;
