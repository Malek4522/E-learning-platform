import React, { useState, useEffect } from "react";
import Navbar from "../common/Navbar";
import Sidebar from "../common/Sidebar";
import "../../styles/course/courseManagement.css";

function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    thumbnail: null,
    enrollmentKey: "",
    chapters: [],
  });

  const [newChapter, setNewChapter] = useState({
    title: "",
    description: "",
    order: 0,
  });

  // Load existing courses
  useEffect(() => {
    const savedCourses = JSON.parse(localStorage.getItem("courses")) || [];
    setCourses(savedCourses);
  }, []);

  const handleCreateCourse = (e) => {
    e.preventDefault();
    const courseToAdd = {
      id: Date.now(),
      ...newCourse,
      chapters: [],
    };

    setCourses((prev) => [...prev, courseToAdd]);
    localStorage.setItem("courses", JSON.stringify([...courses, courseToAdd]));
    setNewCourse({
      title: "",
      description: "",
      thumbnail: null,
      enrollmentKey: "",
      chapters: [],
    });
  };

  const handleAddChapter = (courseId) => {
    const updatedCourses = courses.map((course) => {
      if (course.id === courseId) {
        return {
          ...course,
          chapters: [...course.chapters, { ...newChapter, id: Date.now() }],
        };
      }
      return course;
    });

    setCourses(updatedCourses);
    localStorage.setItem("courses", JSON.stringify(updatedCourses));
    setNewChapter({
      title: "",
      description: "",
      order: 0,
    });
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <main className="dashboard-content">
          <div className="students-header">
            <h1>Course Management</h1>
            <div className="header-actions">
              <div className="search-box">{/* Add search if needed */}</div>
            </div>
          </div>

          <div className="course-management">
            <section className="create-course-section">
              <h3>Create New Course</h3>
              <form onSubmit={handleCreateCourse}>
                <div className="form-group">
                  <label>Course Title</label>
                  <input
                    type="text"
                    value={newCourse.title}
                    onChange={(e) =>
                      setNewCourse((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Course Description</label>
                  <textarea
                    value={newCourse.description}
                    onChange={(e) =>
                      setNewCourse((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Enrollment Key</label>
                  <input
                    type="text"
                    value={newCourse.enrollmentKey}
                    onChange={(e) =>
                      setNewCourse((prev) => ({
                        ...prev,
                        enrollmentKey: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <button type="submit" className="create-course-btn">
                  Create Course
                </button>
              </form>
            </section>

            <section className="existing-courses">
              <h3>Your Courses</h3>
              {courses.map((course) => (
                <div key={course.id} className="course-item">
                  <div className="course-header">
                    <h4>{course.title}</h4>
                    <button onClick={() => setSelectedCourse(course)}>
                      Manage Chapters
                    </button>
                  </div>

                  {selectedCourse?.id === course.id && (
                    <div className="chapter-management">
                      <h5>Add New Chapter</h5>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Chapter Title"
                          value={newChapter.title}
                          onChange={(e) =>
                            setNewChapter((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                        />
                        <button onClick={() => handleAddChapter(course.id)}>
                          Add Chapter
                        </button>
                      </div>

                      <div className="chapters-list">
                        {course.chapters.map((chapter) => (
                          <div key={chapter.id} className="chapter-item">
                            <span>{chapter.title}</span>
                            <button
                              onClick={() => {
                                window.location.href = `/teacher/add-lessons/${course.id}?chapterId=${chapter.id}`;
                              }}
                            >
                              Add Lessons
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CourseManagement;