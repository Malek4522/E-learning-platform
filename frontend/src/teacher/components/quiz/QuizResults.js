import React from 'react';
import '../../styles/quiz/quizResults.css';

function QuizResults() {
  const quizResults = {
    quizTitle: "React Fundamentals Quiz",
    totalStudents: 45,
    averageScore: 82,
    submissions: [
      {
        studentId: 1,
        studentName: "John Doe",
        score: 90,
        submittedAt: "2024-03-15T10:30:00",
        timeSpent: "25 mins",
        answers: [
          { question: 1, correct: true },
          { question: 2, correct: false },
          { question: 3, correct: true }
        ]
      }
    ]
  };

  return (
    <div className="quiz-results">
      <div className="results-header">
        <h2>{quizResults.quizTitle}</h2>
        <div className="results-stats">
          <div className="stat-item">
            <span className="stat-label">Total Submissions</span>
            <span className="stat-value">{quizResults.totalStudents}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Average Score</span>
            <span className="stat-value">{quizResults.averageScore}%</span>
          </div>
        </div>
      </div>

      <div className="results-table">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Score</th>
              <th>Time Spent</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizResults.submissions.map(submission => (
              <tr key={submission.studentId}>
                <td>{submission.studentName}</td>
                <td>
                  <div className="score-cell">
                    <div className="score-bar">
                      <div 
                        className="score-progress"
                        style={{ width: `${submission.score}%` }}
                      ></div>
                    </div>
                    <span>{submission.score}%</span>
                  </div>
                </td>
                <td>{submission.timeSpent}</td>
                <td>{new Date(submission.submittedAt).toLocaleDateString()}</td>
                <td>
                  <button className="view-details-btn">
                    <i className="fas fa-eye"></i> View Details
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

export default QuizResults; 