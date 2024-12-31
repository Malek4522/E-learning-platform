import React, { useState, useEffect } from "react";
import "../styles/pages/Grades.css";

function Grades() {
  const [grades, setGrades] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get grades from localStorage
    const savedGrades = JSON.parse(
      localStorage.getItem("studentGrades") || '{"courses":[]}'
    );
    setGrades(savedGrades);
    setLoading(false);
  }, []);

  if (loading) return <div className="grades-page">Loading grades...</div>;
  if (!grades || grades.courses.length === 0) {
    return (
      <div className="grades-page">
        <h1>My Grades</h1>
        <p>No quizzes completed yet.</p>
      </div>
    );
  }

  return (
    <div className="grades-page">
      <h1>My Grades</h1>

      {grades.courses.map((course) => (
        <div key={course.id} className="course-section">
          <h2 className="course-title">{course.title}</h2>

          {course.quizzes.map((quiz) => (
            <div key={quiz.lessonId} className="lesson-grade">
              <div className="lesson-header">
                <h3 className="lesson-title">{quiz.lessonTitle}</h3>
                <span
                  className={`score ${
                    quiz.score === 100
                      ? "perfect"
                      : quiz.score >= 70
                      ? "good"
                      : "needs-improvement"
                  }`}
                >
                  {quiz.score}%
                </span>
              </div>

              <div className="submission-info">
                Submitted: {new Date(quiz.submittedAt).toLocaleDateString()}
              </div>

              <div className="questions-list">
                {quiz.questions.map((question, index) => (
                  <div key={index} className="question-item">
                    <div className="question-text">{question.question}</div>
                    <div className="answer-details">
                      <p
                        className={`your-answer ${
                          question.correct ? "" : "wrong-answer"
                        }`}
                      >
                        Your answer: {question.yourAnswer}
                      </p>
                      {!question.correct && (
                        <p className="correct-answer">
                          Correct answer: {question.correctAnswer}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Grades;
