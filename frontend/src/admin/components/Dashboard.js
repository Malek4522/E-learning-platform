import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdPeople,
  MdSchool,
  MdPersonAdd,
  MdTrendingUp,
  MdArrowForward,
  MdWavingHand
} from "react-icons/md";
import { GiTeacher } from "react-icons/gi";
import "../styles/Dashboard.css";
import useProtectedRequest from "../../hooks/useProtectedRequest";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    recentActivities: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { makeRequest: fetchStats } = useProtectedRequest('/api/v1/admin/dashboard-stats', 'GET');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetchStats();
        setStats(response);
        setError(null);
      } catch (err) {
        setError("Failed to fetch dashboard statistics");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'NEW_STUDENT':
        return <MdPersonAdd className="activity-icon student-icon" />;
      case 'NEW_INSTRUCTOR':
        return <GiTeacher className="activity-icon instructor-icon" />;
      case 'NEW_COURSE':
      case 'COURSE_UPDATE':
        return <MdSchool className="activity-icon course-icon" />;
      default:
        return <MdPersonAdd className="activity-icon" />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-app">
      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <div className="welcome-icon">
            <MdWavingHand />
          </div>
          <div className="welcome-content">
            <h1>Welcome Back!</h1>
            <p>Here's what's happening with your platform today.</p>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon students">
              <MdPeople />
            </div>
            <div className="stat-details">
              <h3>Total Students</h3>
              <p>{stats.totalStudents}</p>
              <div className="stat-trend">
                <MdTrendingUp /> Active Users
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon instructors">
              <GiTeacher />
            </div>
            <div className="stat-details">
              <h3>Total Instructors</h3>
              <p>{stats.totalInstructors}</p>
              <div className="stat-trend">
                <MdTrendingUp /> Active Teachers
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon courses">
              <MdSchool />
            </div>
            <div className="stat-details">
              <h3>Total Courses</h3>
              <p>{stats.totalCourses}</p>
              <div className="stat-trend">
                <MdTrendingUp /> Available Courses
              </div>
            </div>
          </div>
        </div>

        <div className="activities-container">
          <h2>Recent Activities</h2>
          <div className="activities-list custom-scrollbar">
            {stats.recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon-wrapper">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="activity-details">
                  <h3>{activity.type.replace(/_/g, ' ')}</h3>
                  <p>{activity.description}</p>
                  <div className="activity-footer">
                    <span className="activity-time">{formatTime(activity.time)}</span>
                    {activity.metadata?.link && (
                      <button 
                        className="activity-link"
                        onClick={() => handleNavigate(activity.metadata.link)}
                      >
                        View Details <MdArrowForward />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;