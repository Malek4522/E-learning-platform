import React, { useState } from 'react';
import './Modal.css'; // Use the same styling as the existing modal

function QuizModal({ onClose, onSubmit }) {
  const [quizTitle, setQuizTitle] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([{ question: '', options: ['', '', '', ''], correctAnswer: null }]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const quizData = {
      title: quizTitle,
      questions: quizQuestions,
    };
    onSubmit(quizData);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setQuizTitle('');
    setQuizQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: null }]);
  };

  const handleAddQuestion = () => {
    setQuizQuestions([...quizQuestions, { question: '', options: ['', '', '', ''], correctAnswer: null }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quizQuestions];
    updatedQuestions[index][field] = value;
    setQuizQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...quizQuestions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuizQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex, value) => {
    const updatedQuestions = [...quizQuestions];
    updatedQuestions[questionIndex].correctAnswer = value;
    setQuizQuestions(updatedQuestions);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Quiz</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Quiz Title</label>
            <input
              type="text"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="Enter quiz title"
              required
            />
          </div>
          <h3>Questions</h3>
          {quizQuestions.map((q, index) => (
            <div key={index} className="quiz-question">
              <input
                type="text"
                value={q.question}
                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                placeholder="Enter your question"
                required
              />
              {q.options.map((option, oIndex) => (
                <div key={oIndex} className="option-item">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, oIndex, e.target.value)}
                    placeholder={`Option ${oIndex + 1}`}
                    required
                  />
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={q.correctAnswer === oIndex}
                    onChange={() => handleCorrectAnswerChange(index, oIndex)}
                  />
                </div>
              ))}
            </div>
          ))}
          <button type="button" onClick={handleAddQuestion} className="add-quiz-btn">
            Add Another Question
          </button>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Create Quiz</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuizModal; 