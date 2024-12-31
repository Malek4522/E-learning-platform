import React, { useState } from 'react';
import './Modal.css'; // Use the same styling as the existing modal

function ChapterModal({ onClose, onSubmit }) {
  const [chapterTitle, setChapterTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(chapterTitle);
    setChapterTitle('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Chapter</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
            placeholder="Enter chapter title"
            required
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Create Chapter</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChapterModal; 