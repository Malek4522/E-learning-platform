import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styles from './CourseDetails.module.css'; // Import the CSS module

function CourseDetails({ courses }) {
  const { id } = useParams();
  const course = courses.find(course => course.id === parseInt(id));

  const [selectedLesson, setSelectedLesson] = useState(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  if (!course) {
    return <div>Course not found</div>;
  }

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  return (
    <div className={styles.courseDetails}>
      <header className={styles.headerImage}>
        <h1>{course.title}</h1>
        <p>{course.description}</p>
      </header>
      <div className={styles.courseContent}>
        {selectedLesson && (
          <div className={styles.lessonViewer}>
            <div className={styles.lessonHeader}>
              <h2>{selectedLesson.title}</h2>
            </div>
            <div className={styles.materialViewer}>
              {selectedLesson.materials.map((material, index) => (
                <div key={index} className={styles.materialItem}>
                  {material.type === 'video' ? (
                    <div className={styles.videoPlayerContainer}>
                      <video
                        ref={videoRef}
                        src={material.url}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        controls
                      >
                        Your browser does not support the video tag.
                      </video>
                      <div className={styles.videoControls}>
                        <button 
                          className={styles.playPauseBtn}
                          onClick={() => videoRef.current[isPlaying ? 'pause' : 'play']()}
                        >
                          <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}></i>
                        </button>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progress}
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                          ></div>
                        </div>
                        <div className={styles.timeDisplay}>
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                        <button 
                          className={styles.fullscreenBtn}
                          onClick={() => videoRef.current.requestFullscreen()}
                        >
                          <i className="fas fa-expand"></i>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.pdfViewer}>
                      <iframe
                        src={material.url}
                        title="PDF Viewer"
                        width="100%"
                        height="600px"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className={styles.chaptersContainer}>
          {course.chapters.map(chapter => (
            <div key={chapter.id} className={styles.chapterCard}>
              <div className={styles.chapterHeader}>
                <h3>{chapter.title}</h3>
                <span className={styles.chapterDuration}>
                  <i className="fas fa-clock"></i> {chapter.duration}
                </span>
              </div>
              <div className={styles.lessonsList}>
                {chapter.lessons.map(lesson => (
                  <div 
                    key={lesson.id} 
                    className={`${styles.lessonItem} ${lesson.isCompleted ? styles.completed : ''} ${selectedLesson?.id === lesson.id ? styles.active : ''}`}
                    onClick={() => handleLessonClick(lesson)}
                  >
                    <div className={styles.lessonInfo}>
                      <i className={`fas ${lesson.isCompleted ? 'fa-check-circle' : 'fa-play-circle'}`}></i>
                      <span>{lesson.title}</span>
                    </div>
                    <div className={styles.lessonMeta}>
                      <span className={styles.lessonDuration}>{lesson.duration}</span>
                      <div className={styles.materialIcons}>
                        {lesson.materials?.map(material => (
                          <i key={material.type} className={`fas ${material.type === 'video' ? 'fa-play' : 'fa-file-pdf'}`}></i>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CourseDetails;
