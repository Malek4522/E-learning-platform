import React, { useState } from 'react';
import './Modal.css'; // Use the same styling as the existing modal
import QuizModal from './QuizModal'; // Import the QuizModal

function LessonModal({ onClose, onSubmit }) {
  const [lessonName, setLessonName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [video, setVideo] = useState(null);
  const [document, setDocument] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizData, setQuizData] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const lessonData = {
      title: lessonName,
      description,
      duration,
      materials: {
        video,
        document,
      },
      quiz: quizData,
    };
    onSubmit(lessonData);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setLessonName('');
    setDescription('');
    setDuration('');
    setVideo(null);
    setDocument(null);
    setQuizData(null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Lesson</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Lesson Name</label>
            <input
              type="text"
              value={lessonName}
              onChange={(e) => setLessonName(e.target.value)}
              placeholder="Enter lesson name"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter lesson description"
              required
            />
          </div>
          <div className="form-group">
            <label>Duration</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Duration (e.g., 30 minutes)"
              required
            />
          </div>
          <div className="upload-section">
            <div className="upload-buttons">
              <label className="upload-btn video-upload">
                <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />
                <i className="fas fa-video"></i>
                <span>Add Video</span>
              </label>
              <label className="upload-btn document-upload">
                <input type="file" accept="application/pdf" onChange={(e) => setDocument(e.target.files[0])} />
                <i className="fas fa-file-alt"></i>
                <span>Add Document</span>
              </label>
              <button type="button" onClick={() => setShowQuizModal(true)} className="add-quiz-btn">
                <i className="fas fa-question-circle"></i>
                <span>Add Quiz</span>
              </button>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Create Lesson</button>
          </div>
        </form>
      </div>
      {showQuizModal && (
        <QuizModal 
          onClose={() => setShowQuizModal(false)}
          onSubmit={(data) => {
            setQuizData(data);
            setShowQuizModal(false);
          }}
        />
      )}
    </div>
  );
}

export default LessonModal; 