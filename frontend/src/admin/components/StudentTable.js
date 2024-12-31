import React, { useState } from "react";
import Modal from "./Modal";
import "../styles/StudentTable.css";

function StudentTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [students, setStudents] = useState([
    {
      id: 1,
      matricule: "STD001",
      fullName: "John Doe",
      course: "Web Development",
      joinDate: "2024-01-15",
      email: "john.doe@example.com"
    },
    {
      id: 2,
      matricule: "STD002",
      fullName: "Jane Smith",
      course: "Data Science",
      joinDate: "2024-02-01",
      email: "jane.smith@example.com"
    }
  ]);

  const [newStudent, setNewStudent] = useState({
    matricule: "",
    fullName: "",
    course: "",
    joinDate: "",
    email: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      setStudents(prev => 
        prev.map(student => 
          student.id === newStudent.id ? newStudent : student
        )
      );
    } else {
      const id = students.length + 1;
      setStudents(prev => [...prev, { ...newStudent, id }]);
    }
    handleCloseModal();
  };

  const handleEdit = (student) => {
    setNewStudent(student);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(prev => prev.filter(student => student.id !== id));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setNewStudent({
      matricule: "",
      fullName: "",
      course: "",
      joinDate: "",
      email: ""
    });
  };

  const handleAddNew = () => {
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.matricule.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-app">
      <div className="student-table-container">
        <div className="student-table-header">
          <div className="header-left">
            <h2>Students</h2>
            <p>Total Students: {students.length}</p>
          </div>
          <div className="action-bar">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <i className="fas fa-search"></i>
            </div>
            <button className="add-btn" onClick={handleAddNew}>
              + Add New Student
            </button>
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={isEditMode ? "Edit Student" : "Add New Student"}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Matricule</label>
              <input
                type="text"
                name="matricule"
                value={newStudent.matricule}
                onChange={handleInputChange}
                required
                placeholder="e.g., STD003"
              />
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={newStudent.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Course</label>
              <select
                name="course"
                value={newStudent.course}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Course</option>
                <option value="Web Development">Web Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Cloud Computing">Cloud Computing</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date of Joining</label>
              <input
                type="date"
                name="joinDate"
                value={newStudent.joinDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={newStudent.email}
                onChange={handleInputChange}
                required
                placeholder="example@email.com"
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
                {isEditMode ? 'Update Student' : 'Add Student'}
              </button>
            </div>
          </form>
        </Modal>

        <table className="student-table">
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Full Name</th>
              <th>Course</th>
              <th>Date of Joining</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.matricule}</td>
                <td>{student.fullName}</td>
                <td>{student.course}</td>
                <td>{new Date(student.joinDate).toLocaleDateString()}</td>
                <td>{student.email}</td>
                <td className="actions-cell">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(student)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(student.id)}
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

export default StudentTable;
