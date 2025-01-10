import React, { useState, useEffect } from "react";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import "../../styles/dashboard/students.css";
import useProtectedRequest from "../../../hooks/useProtectedRequest";

function Students() {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);

  const { makeRequest: fetchStudents } = useProtectedRequest('/api/v1/users/courses/enrolled-students');
  const { makeRequest: deleteStudent } = useProtectedRequest('/api/v1/users/courses/remove-student', 'DELETE');

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await fetchStudents();
        setStudents(data);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      }
    };
    loadStudents();
  }, []);

  const handleDelete = async (student) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent({
          courseId: student.courseId,
          studentId: student.studentId
        });
        setStudents(students.filter((s) => s.studentId !== student.studentId));
      } catch (error) {
        console.error('Failed to delete student:', error);
      }
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <main className="dashboard-content">
          <div className="students-header">
            <h1>Students</h1>
            <div className="header-actions">
              <div className="search-box">
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

          <div className="table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Joining Date</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.studentId}>
                    <td>
                      <div className="student-info">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random&color=fff&bold=true&format=svg`}
                          alt={student.name}
                        />
                        <span>{student.name}</span>
                      </div>
                    </td>
                    <td>{student.courseName}</td>
                    <td>{new Date(student.joiningDate).toLocaleDateString()}</td>
                    <td>{student.email}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="delete-btn"
                          title="Delete"
                          onClick={() => handleDelete(student)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Students;
