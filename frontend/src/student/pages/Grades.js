import React, { useState, useEffect } from "react";
import "../styles/pages/Grades.css";
import useProtectedRequest from '../../hooks/useProtectedRequest';

function Grades() {
  const { data: grades, status, makeRequest :fetchGrades} = useProtectedRequest('/api/v1/progress/');

  useEffect(() => {
    fetchGrades();
  }, []);

  if (status.type === 'loading') return <div className="grades-page">Loading grades...</div>;
  if (status.type === 'error') return <div className="grades-page">Error loading grades: {status.message}</div>;
  if (!grades || grades.length === 0) {
    return (
      <div className="grades-page">
        <h1>My Grades</h1>
        <p>No quizzes completed yet.</p>
      </div>
    );
  }

  // Group lessons by chapter for each course
  const groupLessonsByChapter = (lessons) => {
    const chapters = {};
    lessons.forEach((lesson) => {
      const chapterTitle = lesson.chapter_title || 'Uncategorized';
      if (!chapters[chapterTitle]) {
        chapters[chapterTitle] = [];
      }
      chapters[chapterTitle].push(lesson);
    });
    return chapters;
  };

  return (
    <div className="grades-page">
      <h1>My Grades</h1>

      {grades.map((course) => {
        const chapterGroups = groupLessonsByChapter(course.lessons_completed);
        
        return (
          <div key={course.course_id} className="course-section">
            <h2 className="course-title">{course.course_title}</h2>

            {Object.entries(chapterGroups).map(([chapterTitle, lessons]) => (
              <div key={chapterTitle} className="chapter-section">
                <h3 className="chapter-title">{chapterTitle}</h3>
                
                {lessons.map((lesson) => (
                  <div key={lesson.lesson_id} className="lesson-grade">
                    <div className="lesson-header">
                      <h4 className="lesson-title">{lesson.lesson_name || lesson.lesson_id}</h4>
                      <span
                        className={`score ${
                          lesson.quiz_score === 100
                            ? "perfect"
                            : lesson.quiz_score >= 70
                            ? "good"
                            : "needs-improvement"
                        }`}
                      >
                        {lesson.quiz_score}%
                      </span>
                    </div>

                    <div className="submission-info">
                      Content Completed: {lesson.content_completed ? 'Yes' : 'No'}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default Grades;
