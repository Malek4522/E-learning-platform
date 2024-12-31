import React from 'react';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import '../../styles/dashboard/instructorDashboard.css';
import logo from '../../assets/images/logo.png';

function InstructorDashboard() {
  const stats = {
    totalStudents: 1234,
    totalCourses: 12,
    averageRating: 4.8
  };

  const recentActivities = [
    { id: 1, type: 'enrollment', student: 'John Doe', course: 'React JS Basic', time: '2 hours ago' },
    { id: 2, type: 'completion', student: 'Jane Smith', course: 'Advanced Figma', time: '5 hours ago' },
    { id: 3, type: 'enrollment', student: 'Mike Johnson', course: 'Laravel Basics', time: '1 day ago' }
  ];

  const recentCourses = [
    {
      id: 1,
      title: "Basic to Advance Figma",
      lessons: 20,
      duration: 15,
      thumbnail: logo,
      progress: 75
    },
    {
      id: 2,
      title: "React JS Basic to Advance",
      lessons: 25,
      duration: 20,
      thumbnail: logo,
      progress: 45
    },
    {
      id: 3,
      title: "Mastering JS with Laravel",
      lessons: 30,
      duration: 25,
      thumbnail: logo,
      progress: 60
    }
  ];

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <main className="dashboard-content">
          <div className="dashboard-header">
            <h1>Welcome Back, Instructor!</h1>
            <p className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon students">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-details">
                <h3>Total Students</h3>
                <p>{stats.totalStudents}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon courses">
                <i className="fas fa-book"></i>
              </div>
              <div className="stat-details">
                <h3>Total Courses</h3>
                <p>{stats.totalCourses}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon rating">
                <i className="fas fa-star"></i>
              </div>
              <div className="stat-details">
                <h3>Average Rating</h3>
                <p>{stats.averageRating}/5.0</p>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="recent-courses">
              <h2>Course Performance</h2>
              <div className="course-performance-list">
                {recentCourses.map(course => (
                  <div key={course.id} className="performance-item">
                    <div className="course-info">
                      <h3>{course.title}</h3>
                      <div className="course-meta">
                        <span><i className="fas fa-book-open"></i> {course.lessons} Lessons</span>
                        <span><i className="fas fa-users"></i> {course.students || 0} Students</span>
                      </div>
                    </div>
                    <div className="performance-stats">
                      <div className="stat-item">
                        <div className="stat-value">{course.rating || 0}</div>
                        <div className="stat-label">Rating</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-value">{course.completionRate || 0}%</div>
                        <div className="stat-label">Completion</div>
                      </div>
                      <div className="course-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <span>{course.progress}% Progress</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-card recent-activities">
              <h2>Recent Activities</h2>
              <div className="activities-list">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">
                      <i className={`fas ${activity.type === 'enrollment' ? 'fa-user-plus' : 'fa-check-circle'}`}></i>
                    </div>
                    <div className="activity-details">
                      <p>
                        <strong>{activity.student}</strong> {activity.type === 'enrollment' ? 'enrolled in' : 'completed'} <strong>{activity.course}</strong>
                      </p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default InstructorDashboard;