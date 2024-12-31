import React from 'react';
import '../../styles/dashboard/coursePerformance.css';

function CoursePerformance() {
  // Mock data for course performance
  const performanceData = {
    totalEnrollments: 245,
    completionRate: 68,
    averageRating: 4.5,
    totalRevenue: "$3,450",
    metrics: [
      {
        id: 1,
        course: "React JS Basic to Advance",
        students: 89,
        completion: 75,
        rating: 4.8,
        revenue: "$1,200"
      },
      {
        id: 2,
        course: "Advanced Figma",
        students: 65,
        completion: 62,
        rating: 4.3,
        revenue: "$890"
      },
      // Add more courses
    ],
    recentActivity: [
      {
        id: 1,
        type: 'enrollment',
        course: 'React JS Basic',
        date: '2024-03-10',
        count: 5
      },
      {
        id: 2,
        type: 'completion',
        course: 'Advanced Figma',
        date: '2024-03-09',
        count: 3
      }
    ]
  };

  return (
    <div className="course-performance">
      <div className="performance-overview">
        <div className="metric-card">
          <h3>Total Enrollments</h3>
          <p className="metric-value">{performanceData.totalEnrollments}</p>
          <span className="trend positive">↑ 12% this month</span>
        </div>
        <div className="metric-card">
          <h3>Average Completion Rate</h3>
          <p className="metric-value">{performanceData.completionRate}%</p>
          <span className="trend positive">↑ 5% this month</span>
        </div>
        <div className="metric-card">
          <h3>Average Rating</h3>
          <p className="metric-value">{performanceData.averageRating}/5.0</p>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <i 
                key={star}
                className={`fas fa-star ${star <= performanceData.averageRating ? 'filled' : ''}`}
              ></i>
            ))}
          </div>
        </div>
        <div className="metric-card">
          <h3>Total Revenue</h3>
          <p className="metric-value">{performanceData.totalRevenue}</p>
          <span className="trend positive">↑ 8% this month</span>
        </div>
      </div>

      <div className="performance-details">
        <div className="course-metrics">
          <h3>Course-wise Performance</h3>
          <table className="metrics-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Students</th>
                <th>Completion</th>
                <th>Rating</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.metrics.map(course => (
                <tr key={course.id}>
                  <td>{course.course}</td>
                  <td>{course.students}</td>
                  <td>
                    <div className="progress-bar">
                      <div 
                        className="progress" 
                        style={{ width: `${course.completion}%` }}
                      ></div>
                      <span>{course.completion}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="rating">
                      {course.rating}
                      <i className="fas fa-star"></i>
                    </div>
                  </td>
                  <td>{course.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {performanceData.recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  <i className={`fas fa-${activity.type === 'enrollment' ? 'user-plus' : 'check-circle'}`}></i>
                </div>
                <div className="activity-details">
                  <p>
                    <strong>{activity.count} students</strong> {activity.type === 'enrollment' ? 'enrolled in' : 'completed'} <strong>{activity.course}</strong>
                  </p>
                  <span className="activity-date">{new Date(activity.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoursePerformance; 