import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import ChapterModal from "../common/ChapterModal";
import LessonModal from "../common/LessonModal";
import useProtectedRequest from "../../../hooks/useProtectedRequest";
import "../../styles/dashboard/courseDetails.css";

function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState({
    title: '',
    chapters: [],
    id: null,
    totalVideoDuration: 0
  });
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);

  // Setup protected requests
  const { makeRequest: fetchCourse } = useProtectedRequest(`/api/v1/courses/${id}`);
  const { makeRequest: updateCourse } = useProtectedRequest(`/api/v1/courses/${id}`, 'PUT');
  const { makeRequest: deleteCourseRequest } = useProtectedRequest(`/api/v1/courses/${id}`, 'DELETE');

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const courseData = await fetchCourse();
        setCourse(courseData);
      } catch (error) {
        console.error('Error loading course:', error);
      }
    };
    loadCourse();
  }, [id]);

  const handleAddChapter = async (chapterTitle) => {
    const chapterToAdd = {
      chapter_title: chapterTitle,
      lessons: []
    };

    const updatedCourse = {
      ...course,
      chapters: [...course.chapters, chapterToAdd]
    };

    try {
      const result = await updateCourse(updatedCourse);
      setCourse(result);
      setShowAddChapter(false);
    } catch (error) {
      console.error('Error adding chapter:', error);
    }
  };

  const handleAddLesson = async (lessonData) => {
    // Temporary fixed video URL - replace with actual video upload later
    const TEMP_VIDEO_URL = "https://www.youtube.com/watch?v=HashMbjv0qg";
    const TEMP_DOC_URL = "https://www.webpedago.com/media/file/0o5LOTQE/exemple-de-fichier.docx";
    
    const lessonToAdd = {
      title: lessonData.title,
      content: {
        video: {
          video_url: TEMP_VIDEO_URL,
          description: lessonData.description || "Temporary video description",
          duration: parseInt(lessonData.duration) || 0
        },
        document: {
          doc_url: TEMP_DOC_URL,
          description: lessonData.description || "Temporary document description"
        }
      },
      quiz: {
        quiz_title: lessonData.title,
        questions: lessonData.quiz.questions.map(q => ({
          question_text: q.question_text,
          options: q.options,
          correct_answer_index: q.correct_answer_index,
          explanation: q.explanation
        }))
      }
    };

    const updatedChapters = course.chapters.map(chapter => {
      if (chapter._id === currentChapterId) {
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

    try {
      const result = await updateCourse(updatedCourse);
      setCourse(result);
      setShowAddLesson(false);
    } catch (error) {
      console.error('Error adding lesson:', error);
    }
  };

  const handleDeleteLesson = async (chapterId, lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      const updatedChapters = course.chapters.map(chapter => {
        if (chapter._id === chapterId) {
          return {
            ...chapter,
            lessons: chapter.lessons.filter(lesson => lesson._id !== lessonId)
          };
        }
        return chapter;
      });

      const updatedCourse = {
        ...course,
        chapters: updatedChapters
      };

      try {
        const result = await updateCourse(updatedCourse);
        setCourse(result);
      } catch (error) {
        console.error('Error deleting lesson:', error);
      }
    }
  };

  const handleDeleteCourse = async () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourseRequest();
        window.location.href = '/teacher/my-courses';
      } catch (error) {
        console.error('Error deleting course:', error);
      }
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
                    {(() => {
                      const totalMinutes = course.totalVideoDuration || 0;
                      const hours = Math.floor(totalMinutes / 60);
                      const minutes = totalMinutes % 60;
                      return `${hours}h ${minutes}m`;
                    })()} Total Duration
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

            {showAddChapter && (
              <ChapterModal 
                onClose={() => setShowAddChapter(false)} 
                onSubmit={handleAddChapter} 
              />
            )}

            {showAddLesson && (
              <LessonModal 
                onClose={() => setShowAddLesson(false)} 
                onSubmit={handleAddLesson} 
                chapterNumber={currentChapterId}
              />
            )}

            <div className="chapters-list">
              {course.chapters && course.chapters.length > 0 ? (
                course.chapters.map((chapter) => (
                  <div key={chapter._id} className="chapter-item">
                    <h3>{chapter.chapter_title}</h3>
                    <button 
                      className="add-lesson-btn"
                      onClick={() => {
                        setCurrentChapterId(chapter._id);
                        setShowAddLesson(true);
                      }}
                    >
                      <i className="fas fa-plus"></i>
                      Add New Lesson
                    </button>
                    <div className="lessons-list">
                      {chapter.lessons && chapter.lessons.length > 0 ? (
                        chapter.lessons.map((lesson) => (
                          <div key={lesson._id} className="lesson-item">
                            <h4>{lesson.title}</h4>
                            <span>{lesson.content.video?.duration || 0} minutes</span>
                            <button 
                              className="delete-lesson-btn"
                              onClick={() => handleDeleteLesson(chapter._id, lesson._id)}
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
