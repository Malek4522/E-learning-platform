import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const newLessons = [
    {
      id: 1,
      title: "React Hooks Deep Dive",
      courseName: "React JS Basic to Advance",
      addedTime: "Added 2 days ago",
      courseId: "react-101",
      icon: "📚",
    },
    {
      id: 2,
      title: "Advanced Component Patterns",
      courseName: "React JS Basic to Advance",
      addedTime: "Added 3 days ago",
      icon: "📚",
    },
    {
      id: 3,
      title: "Figma Prototyping",
      courseName: "Basic to Advance Figma",
      addedTime: "Added 5 days ago",
      icon: "🎨",
    },
  ];

  const handleGoToLesson = (courseId) => {
    navigate(`/student/courses/${courseId}`);
  };

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
            {newLessons.length > 0 ? (
              <div className="lessons-list">
                {newLessons.map((lesson) => (
                  <div key={lesson.id} className="lesson-item">
                    <div className="lesson-icon">
                      <i className="fas fa-book"></i>
                    </div>
                    <div className="lesson-details">
                      <h4>{lesson.title}</h4>
                      <p>{lesson.courseName}</p>
                      <span className="added-time">{lesson.addedTime}</span>
                    </div>
                    <button
                      className="go-to-lesson-btn"
                      onClick={() => handleGoToLesson(lesson.courseId)}
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
