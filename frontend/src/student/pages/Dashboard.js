import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useProtectedRequest from "../../hooks/useProtectedRequest";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [newLessons, setNewLessons] = useState([]);
  const { makeRequest: fetchDashboardData, status } = useProtectedRequest(
    "/api/v1/users/dashboard",
    "GET"
  );

  const loadDashboardData = async () => {
    try {
      const response = await fetchDashboardData();
      console.log("Dashboard response:", response);
      if (response && response.success) {
        setNewLessons(response.newLessons);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [location.pathname]);

  const handleGoToLesson = (courseId) => {
    navigate(`/student/courses/${courseId}`);
  };

  if (status.type === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="student-app">
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Welcome Back, Student!</h1>
          <span className="date">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="dashboard-content">
          <div className="new-lessons-section">
            <h2>New Lessons Added</h2>
            {newLessons && newLessons.length > 0 ? (
              <div className="lessons-list">
                {newLessons.map((lesson) => (
                  <div key={lesson._id} className="lesson-item">
                    <div className="lesson-icon">
                      <i className="fas fa-book"></i>
                    </div>
                    <div className="lesson-details">
                      <h4>{`${lesson.course_title} - ${lesson.chapter_title}`}</h4>
                      <p>{lesson.lesson_title}</p>
                      <span className="added-time">
                        {new Date(lesson.addedTime).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                    <button
                      className="go-to-lesson-btn"
                      onClick={() => handleGoToLesson(lesson.course_id)}
                    >
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <img src="/images/empty-lessons.svg" alt="No lessons" />
                <p>No new lessons have been added yet.</p>
                <p>Check back later for updates!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
