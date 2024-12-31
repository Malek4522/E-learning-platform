import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/CourseDetails.css";
import DiscussionForum from "./DiscussionForum";

function CourseDetails() {
  const { courseId } = useParams();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [submittedQuizzes, setSubmittedQuizzes] = useState(() => {
    const saved = localStorage.getItem("submittedQuizzes");
    return saved ? JSON.parse(saved) : {};
  });

  const getCourseTitle = (id) => {
    const courseTitles = {
      "react-course": "React JS Basic to Advance",
      "figma-course": "Basic to Advance Figma",
      "javascript-course": "Mastering JS with Laravel",
      "python-course": "Python Programming",
      "uiux-course": "UI/UX Design Fundamentals",
      "nodejs-course": "Node.js Backend Development",
      "fullstack-course": "Full Stack Web Development",
    };
    return courseTitles[id] || "Course Not Found";
  };

  const generateLessonContent = (lessonTitle) => {
    return {
      video: {
        type: "video",
        title: `${lessonTitle} Video`,
        url: "https://example.com/lesson-video.mp4",
      },
      guide: {
        type: "pdf",
        title: `${lessonTitle} Guide`,
        url: "/path/to/lesson-guide.pdf",
      },
      quiz: {
        type: "quiz",
        title: `${lessonTitle} Quiz`,
        questions: [
          {
            id: 1,
            question: "What is React?",
            options: ["Option 1", "Option 2", "Option 3", "Option 4"],
            correctAnswer: 0,
          },
        ],
      },
    };
  };

  const course = {
    id: courseId,
    title: "React JS Basic to Advance",
    stats: {
      lessons: "25 Lessons",
      hours: "20h",
      complete: "0% Complete",
    },
    sections: [
      {
        id: 1,
        title: "Introduction to the Course",
        duration: "45 min",
        lessons: [
          {
            id: "lesson-1",
            title: "Welcome to the Course",
            duration: "10 min",
            completed: true,
            content: generateLessonContent("Welcome to the Course"),
          },
          {
            id: "lesson-2",
            title: "Course Overview",
            duration: "15 min",
            completed: true,
            content: generateLessonContent("Course Overview"),
          },
          {
            id: "lesson-3",
            title: "Setting Up Your Environment",
            duration: "20 min",
            completed: false,
            content: generateLessonContent("Setting Up Your Environment"),
          },
        ],
      },
      {
        id: 2,
        title: "Basic Concepts",
        duration: "1h 30min",
        lessons: [
          {
            id: "lesson-4",
            title: "Core Fundamentals",
            duration: "30 min",
            completed: false,
            content: generateLessonContent("Core Fundamentals"),
          },
          {
            id: "lesson-5",
            title: "Building Blocks",
            duration: "30 min",
            completed: false,
            content: generateLessonContent("Building Blocks"),
          },
          {
            id: "lesson-6",
            title: "Components and Props",
            duration: "30 min",
            completed: false,
            content: generateLessonContent("Components and Props"),
          },
        ],
      },
      {
        id: 3,
        title: "Advanced React Concepts",
        duration: "2h",
        lessons: [
          {
            id: "lesson-7",
            title: "State Management",
            duration: "40 min",
            completed: false,
            content: generateLessonContent("State Management"),
          },
          {
            id: "lesson-8",
            title: "Hooks in Depth",
            duration: "40 min",
            completed: false,
            content: generateLessonContent("Hooks in Depth"),
          },
          {
            id: "lesson-9",
            title: "Context API",
            duration: "40 min",
            completed: false,
            content: generateLessonContent("Context API"),
          },
        ],
      },
      {
        id: 4,
        title: "Practical Applications",
        duration: "2h 15min",
        lessons: [
          {
            id: "lesson-10",
            title: "Building Forms",
            duration: "45 min",
            completed: false,
            content: generateLessonContent("Building Forms"),
          },
          {
            id: "lesson-11",
            title: "API Integration",
            duration: "45 min",
            completed: false,
            content: generateLessonContent("API Integration"),
          },
          {
            id: "lesson-12",
            title: "Authentication",
            duration: "45 min",
            completed: false,
            content: generateLessonContent("Authentication"),
          },
        ],
      },
      {
        id: 5,
        title: "Project Development",
        duration: "3h",
        lessons: [
          {
            id: "lesson-13",
            title: "Project Setup",
            duration: "60 min",
            completed: false,
            content: generateLessonContent("Project Setup"),
          },
          {
            id: "lesson-14",
            title: "Implementation",
            duration: "60 min",
            completed: false,
            content: generateLessonContent("Implementation"),
          },
          {
            id: "lesson-15",
            title: "Deployment",
            duration: "60 min",
            completed: false,
            content: generateLessonContent("Deployment"),
          },
        ],
      },
    ],
  };

  const handleLessonClick = (lesson) => {
    if (selectedLesson?.id === lesson.id) {
      setSelectedLesson(null);
      setSelectedContent(null);
    } else {
      setSelectedLesson(lesson);
      setSelectedContent(null);
    }
  };

  const handleContentClick = (content) => {
    setSelectedContent(content);
    if (content.type === "pdf") {
      window.open(content.url, "_blank");
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
        return quizAnswers[question.id] === question.correctAnswer
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
      lessonTitle: selectedLesson.title,
      score,
      submittedAt: new Date().toISOString(),
      questions: selectedContent.questions.map((q) => ({
        question: q.question,
        yourAnswer: q.options[quizAnswers[q.id]],
        correctAnswer: q.options[q.correctAnswer],
        correct: quizAnswers[q.id] === q.correctAnswer,
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

    localStorage.setItem("studentGrades", JSON.stringify(savedGrades));
    localStorage.setItem(
      "submittedQuizzes",
      JSON.stringify(newSubmittedQuizzes)
    );

    setSubmittedQuizzes(newSubmittedQuizzes);
    setQuizAnswers({});
  };

  return (
    <div className="course-details-page">
      <div className="course-header">
        <h1>{course.title}</h1>
        <div className="course-stats">
          <span>
            <i className="fas fa-book-open"></i> {course.stats.lessons}
          </span>
          <span>
            <i className="fas fa-clock"></i> {course.stats.hours}
          </span>
          <span>
            <i className="fas fa-chart-line"></i> {course.stats.complete}
          </span>
        </div>
      </div>

      {selectedLesson && (
        <>
          <div className="lesson-content">
            <h2>{selectedLesson.title}</h2>
            <div className="content-tabs">
              <button
                className={`tab-btn ${
                  selectedContent?.type === "video" ? "active" : ""
                }`}
                onClick={() => handleContentClick(selectedLesson.content.video)}
              >
                <i className="fas fa-play-circle"></i> Video Lesson
              </button>
              <button
                className={`tab-btn ${
                  selectedContent?.type === "pdf" ? "active" : ""
                }`}
                onClick={() => handleContentClick(selectedLesson.content.guide)}
              >
                <i className="fas fa-file-pdf"></i> Lesson Guide
              </button>
              <button
                className={`tab-btn ${
                  selectedContent?.type === "quiz" ? "active" : ""
                }`}
                onClick={() => handleContentClick(selectedLesson.content.quiz)}
              >
                <i className="fas fa-question-circle"></i> Quiz
              </button>
            </div>

            {selectedContent?.type === "video" && (
              <div className="video-container">
                <video controls>
                  <source src={selectedContent.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {selectedContent?.type === "quiz" && (
              <div className="quiz-container">
                <h3>{selectedContent.title}</h3>
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
                        <p className="question-text">{question.question}</p>
                        <div className="options-list">
                          {question.options.map((option, optionIndex) => (
                            <label key={optionIndex} className={`option-label`}>
                              <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={optionIndex}
                                checked={
                                  quizAnswers[question.id] === optionIndex
                                }
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

          <div className="lesson-discussion">
            <DiscussionForum
              courseId={courseId}
              lessonId={selectedLesson.id}
              lessonTitle={selectedLesson.title}
            />
          </div>
        </>
      )}

      <div className="course-sections">
        {course.sections.map((section) => (
          <div key={section.id} className="section">
            <div className="section-header">
              <h2>{section.title}</h2>
              <span className="duration">
                <i className="fas fa-clock"></i> {section.duration}
              </span>
            </div>
            <div className="lessons">
              {section.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className={`lesson-item ${
                    lesson.completed ? "completed" : ""
                  } ${selectedLesson?.id === lesson.id ? "active" : ""}`}
                  onClick={() => handleLessonClick(lesson)}
                >
                  <div className="lesson-left">
                    <span className="status-icon">
                      {lesson.completed ? (
                        <i className="fas fa-check-circle"></i>
                      ) : (
                        <i className="fas fa-play-circle"></i>
                      )}
                    </span>
                    <span className="lesson-title">{lesson.title}</span>
                  </div>
                  <span className="lesson-duration">{lesson.duration}</span>
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
