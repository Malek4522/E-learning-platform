import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import "../styles/InstructorTable.css";
import useProtectedRequest from "../../hooks/useProtectedRequest";

function InstructorTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [instructors, setInstructors] = useState([]);
  
  // Initialize the hooks with proper URLs and methods
  const { makeRequest: fetchInstructors } = useProtectedRequest('/api/v1/admin/users', 'GET');
  const { makeRequest: addTeacher } = useProtectedRequest('/api/v1/admin/teachers', 'POST');
  const { makeRequest: deleteTeacher } = useProtectedRequest(`/api/v1/admin/users`, 'DELETE');

  const [newInstructor, setNewInstructor] = useState({
    email: "",
    password: "",
    card_number: ""
  });

  const loadInstructors = async () => {
    try {
      setIsLoading(true);
      const response = await fetchInstructors();
      const teachersList = response.filter(user => user.role === 'teacher');
      setInstructors(teachersList);
      setError(null);
    } catch (err) {
      setError("Failed to fetch instructors: " + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInstructors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInstructor(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!newInstructor.email || !newInstructor.password) {
        setError("Email and password are required");
        return;
      }

      if (newInstructor.password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }

      if (!newInstructor.card_number || isNaN(newInstructor.card_number)) {
        setError("Card number must be a valid number");
        return;
      }

      const formData = {
        email: newInstructor.email,
        password: newInstructor.password,
        card_number: parseInt(newInstructor.card_number)
      };

      try {
        await addTeacher(formData);
        setError(null);
        handleCloseModal();
        await loadInstructors();
      } catch (err) {
        if (err.response?.status === 400) {
          const errorMessage = err.response.data.message || 
                             err.response.data.errors?.[0]?.msg || 
                             "Invalid input data";
          setError(errorMessage);
        } else if (err.response?.status === 409) {
          setError("An account with this email already exists");
        } else {
          setError("Failed to add instructor. Please try again.");
        }
        console.error('Error adding instructor:', err.response?.data || err);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error('Error in form submission:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this instructor?')) {
      try {
        await deleteTeacher(null, `/api/v1/admin/users/${id}`);
        await loadInstructors();
        setError(null);
      } catch (err) {
        setError("Failed to delete instructor: " + (err.response?.data?.message || err.message));
        console.error(err);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
    setNewInstructor({
      email: "",
      password: "",
      card_number: ""
    });
  };

  const filteredInstructors = instructors.filter(instructor =>
    instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.profile?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.profile?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (instructor.card_number && instructor.card_number.toString().includes(searchTerm))
  );

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-app">
      <div className="instructor-table-container">
        {error && <div className="error-message">{error}</div>}
        
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
              onClick={() => setIsModalOpen(true)}
            >
              + Add New Instructor
            </button>
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Add New Instructor"
        >
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={newInstructor.email}
                onChange={handleInputChange}
                required
                placeholder="Enter email address"
              />
            </div>
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={newInstructor.password}
                onChange={handleInputChange}
                required
                minLength={6}
                placeholder="Minimum 6 characters"
              />
            </div>
            <div className="form-group">
              <label>Card Number *</label>
              <input
                type="number"
                name="card_number"
                value={newInstructor.card_number}
                onChange={handleInputChange}
                required
                min="1"
                placeholder="Enter card number"
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
                Add Instructor
              </button>
            </div>
          </form>
        </Modal>

        <table className="instructor-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Card Number</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInstructors.map((instructor) => (
              <tr key={instructor._id}>
                <td>{instructor.email}</td>
                <td>{instructor.card_number || 'Not assigned'}</td>
                <td>{instructor.role}</td>
                <td className="actions-cell">
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(instructor._id)}
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
