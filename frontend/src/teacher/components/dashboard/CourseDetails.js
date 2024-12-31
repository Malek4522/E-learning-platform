import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import ChapterModal from "../common/ChapterModal";
import LessonModal from "../common/LessonModal";
import "../../styles/dashboard/courseDetails.css";

function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState({
    title: '',
    chapters: [],
    id: null
  });
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);

  useEffect(() => {
    const courses = JSON.parse(localStorage.getItem("courses")) || [];
    const currentCourse = courses.find((c) => c.id === parseInt(id));
    if (currentCourse) {
      setCourse({
        ...currentCourse,
        chapters: currentCourse.chapters || []
      });
    }
  }, [id]);

  const handleAddChapter = (chapterTitle) => {
    const chapterToAdd = {
      id: Date.now(),
      title: chapterTitle,
      lessons: []
    };

    const updatedCourse = {
      ...course,
      chapters: [...course.chapters, chapterToAdd]
    };

    // Update localStorage
    const courses = JSON.parse(localStorage.getItem("courses")) || [];
    const updatedCourses = courses.map(c => 
      c.id === course.id ? updatedCourse : c
    );
    localStorage.setItem("courses", JSON.stringify(updatedCourses));
    
    setCourse(updatedCourse);
    setShowAddChapter(false);
  };

  const handleAddLesson = (lessonData) => {
    const lessonToAdd = {
      id: Date.now(),
      ...lessonData,
      materials: []
    };

    const updatedChapters = course.chapters.map(chapter => {
      if (chapter.id === currentChapterId) {
        return {
          ...chapter,
          lessons: [...chapter.lessons, lessonToAdd]
        };
      }
      return chapter;
    });

    const updatedCourse = {
      ...course,
      chapters: updatedChapters
    };

    // Update localStorage
    const courses = JSON.parse(localStorage.getItem("courses")) || [];
    const updatedCourses = courses.map(c => 
      c.id === course.id ? updatedCourse : c
    );
    localStorage.setItem("courses", JSON.stringify(updatedCourses));
    
    setCourse(updatedCourse);
    setShowAddLesson(false);
  };

  const handleDeleteLesson = (lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      const updatedChapters = course.chapters.map(chapter => {
        return {
          ...chapter,
          lessons: chapter.lessons.filter(lesson => lesson.id !== lessonId)
        };
      });

      const updatedCourse = {
        ...course,
        chapters: updatedChapters
      };

      // Update localStorage
      const courses = JSON.parse(localStorage.getItem("courses")) || [];
      const updatedCourses = courses.map(c => 
        c.id === course.id ? updatedCourse : c
      );
      localStorage.setItem("courses", JSON.stringify(updatedCourses));
      
      setCourse(updatedCourse);
    }
  };

  const handleDeleteCourse = () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      const courses = JSON.parse(localStorage.getItem("courses")) || [];
      const updatedCourses = courses.filter(c => c.id !== course.id);
      localStorage.setItem("courses", JSON.stringify(updatedCourses));
      
      // Navigate back to courses page
      window.location.href = '/teacher/my-courses';
    }
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <main className="dashboard-content">
          <div className="course-details">
            <div className="course-header">
              <div className="course-info">
                <h1>{course.title}</h1>
                <div className="course-stats">
                  <span>
                    <i className="fas fa-book-open"></i>
                    {course.chapters?.length || 0} Chapters
                  </span>
                  <span>
                    <i className="fas fa-clock"></i>
                    {course.duration || 0}h Total Duration
                  </span>
                  <span>
                    <i className="fas fa-chart-line"></i>
                    {course.progress || 0}% Complete
                  </span>
                </div>
              </div>
              <div className="header-actions">
                <button 
                  className="add-chapter-btn"
                  onClick={() => setShowAddChapter(true)}
                >
                  <i className="fas fa-plus"></i>
                  Add New Chapter
                </button>
                <button 
                  className="delete-course-btn"
                  onClick={handleDeleteCourse}
                >
                  <i className="fas fa-trash"></i>
                  Delete Course
                </button>
              </div>
            </div>

            {/* Add Chapter Modal */}
            {showAddChapter && (
              <ChapterModal 
                onClose={() => setShowAddChapter(false)} 
                onSubmit={handleAddChapter} 
              />
            )}

            {/* Add Lesson Modal */}
            {showAddLesson && (
              <LessonModal 
                onClose={() => setShowAddLesson(false)} 
                onSubmit={handleAddLesson} 
                chapterNumber={currentChapterId}
              />
            )}

            {/* Display existing chapters */}
            <div className="chapters-list">
              {course.chapters.length > 0 ? (
                course.chapters.map((chapter) => (
                  <div key={chapter.id} className="chapter-item">
                    <h3>{chapter.title}</h3>
                    <button 
                      className="add-lesson-btn"
                      onClick={() => {
                        setCurrentChapterId(chapter.id);
                        setShowAddLesson(true);
                      }}
                    >
                      <i className="fas fa-plus"></i>
                      Add New Lesson
                    </button>
                    {/* Display lessons for this chapter */}
                    <div className="lessons-list">
                      {chapter.lessons.length > 0 ? (
                        chapter.lessons.map((lesson) => (
                          <div key={lesson.id} className="lesson-item">
                            <h4>{lesson.title}</h4>
                            <span>{lesson.duration} minutes</span>
                            <button 
                              className="delete-lesson-btn"
                              onClick={() => handleDeleteLesson(lesson.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="no-lessons">
                          <p>No lessons added yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-chapters">
                  <p>No chapters added yet</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CourseDetails;
