import React, { useState } from "react";
import Modal from "./Modal";
import "../styles/InstructorTable.css";

function InstructorTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [instructors, setInstructors] = useState([
    {
      id: 1,
      name: "Dr. John Smith",
      specialization: "Computer Science",
      email: "john.smith@example.com",
      phone: "+1234567890",
      courses: "Web Development, Python Programming"
    },
    {
      id: 2,
      name: "Prof. Sarah Johnson",
      specialization: "Data Science",
      email: "sarah.j@example.com",
      phone: "+1987654321",
      courses: "Machine Learning, Data Analytics"
    }
  ]);

  const [newInstructor, setNewInstructor] = useState({
    name: "",
    specialization: "",
    email: "",
    phone: "",
    courses: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInstructor(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      setInstructors(prev => 
        prev.map(instructor => 
          instructor.id === newInstructor.id ? newInstructor : instructor
        )
      );
    } else {
      const id = instructors.length + 1;
      setInstructors(prev => [...prev, { ...newInstructor, id }]);
    }
    handleCloseModal();
  };

  const handleEdit = (instructor) => {
    setNewInstructor(instructor);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this instructor?')) {
      setInstructors(prev => prev.filter(instructor => instructor.id !== id));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setNewInstructor({
      name: "",
      specialization: "",
      email: "",
      phone: "",
      courses: ""
    });
  };

  const handleAddNew = () => {
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const filteredInstructors = instructors.filter(instructor =>
    Object.values(instructor).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="admin-app">
      <div className="instructor-table-container">
        <div className="table-header">
          <div className="header-left">
            <h2>Instructors</h2>
            <p>Total Instructors: {instructors.length}</p>
          </div>
          <div className="header-right">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search"></i>
            </div>
            <button 
              className="add-instructor-btn"
              onClick={handleAddNew}
            >
              + Add New Instructor
            </button>
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={isEditMode ? "Edit Instructor" : "Add New Instructor"}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={newInstructor.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Specialization</label>
              <select
                name="specialization"
                value={newInstructor.specialization}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Specialization</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Data Science">Data Science</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
              </select>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={newInstructor.email}
                onChange={handleInputChange}
                required
                placeholder="example@email.com"
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={newInstructor.phone}
                onChange={handleInputChange}
                required
                placeholder="+1234567890"
              />
            </div>
            <div className="form-group">
              <label>Courses (comma-separated)</label>
              <input
                type="text"
                name="courses"
                value={newInstructor.courses}
                onChange={handleInputChange}
                required
                placeholder="e.g., Web Development, Python Programming"
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
                {isEditMode ? 'Update Instructor' : 'Add Instructor'}
              </button>
            </div>
          </form>
        </Modal>

        <table className="instructor-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialization</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Courses</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInstructors.map((instructor) => (
              <tr key={instructor.id}>
                <td>{instructor.name}</td>
                <td>{instructor.specialization}</td>
                <td>{instructor.email}</td>
                <td>{instructor.phone}</td>
                <td>{instructor.courses}</td>
                <td className="actions-cell">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(instructor)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(instructor.id)}
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
}

export default InstructorTable;
