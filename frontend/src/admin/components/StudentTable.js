import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import "../styles/StudentTable.css";
import useProtectedRequest from "../../hooks/useProtectedRequest";

function StudentTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);

  // Initialize API endpoints
  const { makeRequest: fetchStudents } = useProtectedRequest('/api/v1/admin/users', 'GET');
  const { makeRequest: updateStudent } = useProtectedRequest('/api/v1/admin/users', 'PUT');
  const { makeRequest: deleteStudent } = useProtectedRequest('/api/v1/admin/users', 'DELETE');

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      const response = await fetchStudents();
      const studentsList = response.filter(user => user.role === 'student');
      setStudents(studentsList);
      setError(null);
    } catch (err) {
      setError("Failed to fetch students: " + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingStudent) {
      setEditingStudent(prev => ({
        ...prev,
        [name]: value,
        profile: {
          ...prev.profile,
          [name]: value
        }
      }));
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateStudent(
        { 
          email: editingStudent.email,
          profile: editingStudent.profile
        }, 
        `/api/v1/admin/users/${editingStudent._id}`
      );
      setError(null);
      handleCloseModal();
      await loadStudents();
    } catch (err) {
      setError("Failed to update student: " + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(null, `/api/v1/admin/users/${id}`);
        await loadStudents();
        setError(null);
      } catch (err) {
        setError("Failed to delete student: " + (err.response?.data?.message || err.message));
        console.error(err);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setError(null);
  };

  const filteredStudents = students.filter(student =>
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.profile?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.profile?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-app">
      <div className="student-table-container">
        {error && <div className="error-message">{error}</div>}
        
        <div className="table-header">
          <div className="header-left">
            <h2>Students</h2>
            <p>Total Students: {students.length}</p>
          </div>
          <div className="header-right">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search"></i>
            </div>
          </div>
        </div>

        {editingStudent && (
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title="Edit Student"
          >
            <form onSubmit={handleUpdate}>
              {error && <div className="error-message">{error}</div>}
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editingStudent.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={editingStudent.profile?.first_name || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={editingStudent.profile?.last_name || ''}
                  onChange={handleInputChange}
                  required
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
                  Update Student
                </button>
              </div>
            </form>
          </Modal>
        )}

        <table className="student-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Progress</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id}>
                <td>{`${student.profile?.first_name || ''} ${student.profile?.last_name || ''}`}</td>
                <td>{student.email}</td>
                <td>{student.progress || '0%'}</td>
                <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                <td className="actions-cell">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(student)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(student._id)}
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
