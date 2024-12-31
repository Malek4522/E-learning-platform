import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdPeople,
  MdSchool,
  MdPersonAdd,
  MdTrendingUp,
  MdArrowForward
} from "react-icons/md";
import { GiTeacher } from "react-icons/gi";
import "../styles/Dashboard.css";

const recentActivities = [
  {
    id: 1,
    type: "New Student",
    description: "John Doe registered as a student",
    time: "2 hours ago",
    icon: <MdPersonAdd className="activity-icon student-icon" />,
    link: "/admin/students/1",
    linkText: "View Profile"
  },
  {
    id: 2,
    type: "New Course",
    description: "Web Development course was added",
    time: "3 hours ago",
    icon: <MdSchool className="activity-icon course-icon" />,
    link: "/admin/courses/1",
    linkText: "View Course"
  },
  {
    id: 3,
    type: "New Instructor",
    description: "Sarah Johnson joined as instructor",
    time: "5 hours ago",
    icon: <GiTeacher className="activity-icon instructor-icon" />,
    link: "/admin/instructors/1",
    linkText: "View Profile"
  },
  {
    id: 4,
    type: "New Student",
    description: "Alice Smith enrolled in Data Science",
    time: "6 hours ago",
    icon: <MdPersonAdd className="activity-icon student-icon" />,
    link: "/admin/students/2",
    linkText: "View Profile"
  },
  {
    id: 5,
    type: "Course Update",
    description: "Python Programming syllabus updated",
    time: "8 hours ago",
    icon: <MdSchool className="activity-icon course-icon" />,
    link: "/admin/courses/2",
    linkText: "View Course"
  }
];

function Dashboard() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-app">
      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <h1>Welcome Back!</h1>
          <p>Here's what's happening with your platform today.</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon students">
              <MdPeople />
            </div>
            <div className="stat-details">
              <h3>Total Students</h3>
              <p>1,234</p>
              <div className="stat-trend">
                <MdTrendingUp /> +5% this week
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon courses">
              <MdSchool />
            </div>
            <div className="stat-details">
              <h3>Total Courses</h3>
              <p>56</p>
              <div className="stat-trend">
                <MdTrendingUp /> +2% this week
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon instructors">
              <GiTeacher />
            </div>
            <div className="stat-details">
              <h3>Total Instructors</h3>
              <p>89</p>
              <div className="stat-trend">
                <MdTrendingUp /> +3% this week
              </div>
            </div>
          </div>
        </div>

        <div className="activities-container">
          <h2>Recent Activities</h2>
          <div className="activities-list custom-scrollbar">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon-wrapper">
                  {activity.icon}
                </div>
                <div className="activity-details">
                  <h3>{activity.type}</h3>
                  <p>{activity.description}</p>
                  <div className="activity-footer">
                    <span className="activity-time">{activity.time}</span>
                    <button 
                      className="activity-link"
                      onClick={() => handleNavigate(activity.link)}
                    >
                      {activity.linkText} <MdArrowForward />
                    </button>
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