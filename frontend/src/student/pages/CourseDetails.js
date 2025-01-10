import React, { useState, useEffect } from "react";
import { useParams} from "react-router-dom";
import "../styles/CourseDetails.css";
import useProtectedRequest from "../../hooks/useProtectedRequest";

function CourseDetails() {
  const { courseId } = useParams();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [submittedQuizzes, setSubmittedQuizzes] = useState({});

  const { data: course, status, makeRequest } = useProtectedRequest(`/api/v1/courses/${courseId}`, 'GET');
  const { data: progressData, status: progressStatus, makeRequest: fetchProgress } = useProtectedRequest(`/api/v1/progress/${courseId}`, 'GET');
  const { data: progress, status: updateProgressStatus, makeRequest: updateProgress } = useProtectedRequest(`/api/v1/progress/${courseId}`, 'PUT');

  useEffect(() => {
    makeRequest();    
    fetchProgress();
    
  }, [courseId]);

  useEffect(() => {
    fetchProgress();
  }, [courseId]);

  useEffect(() => {
    if (progressData) {
      const submitted = progressData.lessons_completed.reduce((acc, lesson) => {
        acc[lesson.lesson_id] = lesson.content_completed;
        return acc;
      }, {});
      setSubmittedQuizzes(submitted);
    }
  }, [progressData]);

  const handleLessonClick = (lesson) => {
    if (selectedLesson?.id === lesson.id) {
      setSelectedLesson(null);
      setSelectedContent(null);
    } else {
      setSelectedLesson(lesson);
      setSelectedContent(null);
    }
  };

  const handleContentClick = (contentType) => {
    if (!selectedLesson) return;
    
    if (contentType === 'video') {
      setSelectedContent({
        type: 'video',
        ...selectedLesson.content.video
      });
    } else if (contentType === 'document' && selectedLesson.content.document) {
      setSelectedContent({
        type: 'document',
        ...selectedLesson.content.document
      });
    } else if (contentType === 'quiz') {
      setSelectedContent({
        type: 'quiz',
        ...selectedLesson.quiz
      });
    }
  };

  const isQuizSubmitted = selectedLesson && submittedQuizzes[selectedLesson.id];

  const calculateQuizScore = () => {
    if (!selectedContent?.questions || Object.keys(quizAnswers).length === 0) {
      return 0;
    }

    const totalQuestions = selectedContent.questions.length;
    const correctAnswers = selectedContent.questions.reduce(
      (count, question) => {
        return quizAnswers[question.id] === question.correct_answer_index
          ? count + 1
          : count;
      },
      0
    );

    return Math.round((correctAnswers / totalQuestions) * 100);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    if (isQuizSubmitted) return;
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleQuizSubmit = () => {
    if (Object.keys(quizAnswers).length === 0 || !selectedLesson) return;

    const score = calculateQuizScore();
    const quizResults = {
      lessonId: selectedLesson.id,
      lessonTitle: selectedLesson.quiz.quiz_title,
      score,
      submittedAt: new Date().toISOString(),
      questions: selectedContent.questions.map((q) => ({
        question: q.question_text,
        yourAnswer: q.options[quizAnswers[q.id]],
        correctAnswer: q.options[q.correct_answer_index],
        correct: quizAnswers[q.id] === q.correct_answer_index,
        explanation: q.explanation
      })),
    };

    // Save to grades
    const savedGrades = JSON.parse(
      localStorage.getItem("studentGrades") || '{"courses":[]}'
    );
    const courseIndex = savedGrades.courses.findIndex((c) => c.id === courseId);

    if (courseIndex === -1) {
      savedGrades.courses.push({
        id: courseId,
        title: course.title,
        quizzes: [quizResults],
      });
    } else {
      savedGrades.courses[courseIndex].quizzes.push(quizResults);
    }

    // Mark this quiz as submitted
    const newSubmittedQuizzes = {
      ...submittedQuizzes,
      [selectedLesson.id]: true,
    };


    // Use useProtectedRequest to update progress
    updateProgress({
      courseId: courseId,
      chapterId: selectedContent.id,
      lessonId: selectedLesson.id,
      contentCompleted: true,
      quizScore: score
    });

    setSubmittedQuizzes(newSubmittedQuizzes);
    setQuizAnswers({});
  };

  const isLessonCompleted = (lessonId) => {
    return submittedQuizzes[lessonId] || false;
  };

  if (!course) {
    return <div className="loading">Loading course details...</div>;
  }

  return (
    <div className="course-details-page">
      <div className="course-header">
        <h1>{course.title}</h1>
        <div className="course-stats">
          <span>
            <i className="fas fa-book-open"></i> {course.chapters.reduce((total, chapter) => total + chapter.lessons.length, 0)} Lessons
          </span>
          <span>
            <i className="fas fa-clock"></i> {`${String(Math.floor(course.totalVideoDuration / 60)).padStart(2, '0')}h ${String(course.totalVideoDuration % 60).padStart(2, '0')}min`}
          </span>
          <span>
            <i className="fas fa-file"></i> {course.totalDocuments} Documents
          </span>
          {course.averageRating > 0 && (
            <span>
              <i className="fas fa-star"></i> {course.averageRating.toFixed(1)}
            </span>
          )}
        </div>
        <p className="course-description">{course.description}</p>
      </div>

      {selectedLesson && (
        <div className="lesson-content">
          <h2>{selectedLesson.quiz?.quiz_title || "Lesson Content"}</h2>
          <div className="content-tabs">
            {selectedLesson.content.video && (
              <button
                className={`tab-btn ${
                  selectedContent?.type === "video" ? "active" : ""
                }`}
                onClick={() => handleContentClick('video')}
              >
                <i className="fas fa-play-circle"></i> Video Lesson
              </button>
            )}
            {selectedLesson.content.document && (
              <a
                href={selectedLesson.content.document.doc_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`tab-btn ${
                  selectedContent?.type === "document" ? "active" : ""
                }`}
                download
              >
                <i className="fas fa-file-pdf"></i> Lesson Document
              </a>
            )}
            {selectedLesson.quiz && (
              <button
                className={`tab-btn ${
                  selectedContent?.type === "quiz" ? "active" : ""
                }`}
                onClick={() => handleContentClick('quiz')}
              >
                <i className="fas fa-question-circle"></i> Quiz
              </button>
            )}
          </div>

          {selectedContent?.type === "video" && (
            <div className="video-container">
              <iframe 
                src={selectedContent.video_url.replace('youtube.com/watch?v=', 'youtube.com/embed/').replace('youtu.be/', 'youtube.com/embed/')}
                title="YouTube video player"
                frameBorder="0"
                width="100%"
                height="480"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
              </iframe>
              {selectedContent.description && (
                <p className="video-description">{selectedContent.description}</p>
              )}
            </div>
          )}

          {selectedContent?.type === "quiz" && (
            <div className="quiz-container">
              <h3>{selectedContent.quiz_title}</h3>
              {isQuizSubmitted ? (
                <div className="quiz-submitted-message">
                  <p>You have already completed this quiz.</p>
                  <p>Check your grades to see your results.</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleQuizSubmit();
                  }}
                >
                  {selectedContent.questions.map((question) => (
                    <div key={question.id} className="quiz-question">
                      <p className="question-text">{question.question_text}</p>
                      <div className="options-list">
                        {question.options.map((option, optionIndex) => (
                          <label key={optionIndex} className={`option-label`}>
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={optionIndex}
                              checked={quizAnswers[question.id] === optionIndex}
                              onChange={() =>
                                handleAnswerSelect(question.id, optionIndex)
                              }
                              disabled={isQuizSubmitted}
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  {!isQuizSubmitted && (
                    <button type="submit" className="submit-quiz-btn">
                      Submit Quiz
                    </button>
                  )}
                </form>
              )}
            </div>
          )}
        </div>
      )}

      <div className="course-sections">
        {course.chapters?.map((chapter) => (
          <div key={chapter.id} className="section">
            <div className="section-header">
              <h2>{chapter.chapter_title}</h2>
            </div>
            <div className="lessons">
              {chapter.lessons?.map((lesson) => (
                <div
                  key={lesson.id}
                  className={`lesson-item ${
                    selectedLesson?.id === lesson.id ? "active" : ""
                  } ${isLessonCompleted(lesson.id) ? "completed" : ""}`}
                  onClick={() => handleLessonClick(lesson)}
                >
                  <div className="lesson-left">
                    <span className="status-icon">
                      <i className="fas fa-play-circle"></i>
                    </span>
                    <span className="lesson-title">
                      {lesson.quiz?.quiz_title || "Lesson Content"}
                    </span>
                  </div>
                  {lesson.content.video && (
                    <span className="lesson-duration">
                      {Math.floor(lesson.content.video.duration / 60)}:{String(lesson.content.video.duration % 60).padStart(2, '0')}
                    </span>
                  )}
                  {isLessonCompleted(lesson.id) && (
                    <span className="completion-status">
                      Completed
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseDetails;
