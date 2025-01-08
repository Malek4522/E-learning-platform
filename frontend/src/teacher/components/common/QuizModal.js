import React, { useState } from 'react';
import './Modal.css';

function QuizModal({ onClose, onSubmit }) {
  const [quizTitle, setQuizTitle] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([{
    question_text: '',
    options: ['', ''],
    correct_answer_index: null,
    explanation: ''
  }]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const quizData = {
      quiz_title: quizTitle,
      questions: quizQuestions.map(q => ({
        question_text: q.question_text,
        options: q.options.filter(opt => opt.trim() !== ''),
        correct_answer_index: q.correct_answer_index,
        explanation: q.explanation
      }))
    };
    onSubmit(quizData);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setQuizTitle('');
    setQuizQuestions([{
      question_text: '',
      options: ['', ''],
      correct_answer_index: null,
      explanation: ''
    }]);
  };

  const handleAddQuestion = () => {
    setQuizQuestions([...quizQuestions, {
      question_text: '',
      options: ['', ''],
      correct_answer_index: null,
      explanation: ''
    }]);
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

  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...quizQuestions];
    if (updatedQuestions[questionIndex].options.length < 5) {
      updatedQuestions[questionIndex].options.push('');
      setQuizQuestions(updatedQuestions);
    }
  };

  const handleRemoveOption = (questionIndex) => {
    const updatedQuestions = [...quizQuestions];
    if (updatedQuestions[questionIndex].options.length > 2) {
      updatedQuestions[questionIndex].options.pop();
      // Reset correct answer if it was the last option
      if (updatedQuestions[questionIndex].correct_answer_index >= updatedQuestions[questionIndex].options.length) {
        updatedQuestions[questionIndex].correct_answer_index = null;
      }
      setQuizQuestions(updatedQuestions);
    }
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
              <div className="form-group">
                <label>Question {index + 1}</label>
                <input
                  type="text"
                  value={q.question_text}
                  onChange={(e) => handleQuestionChange(index, 'question_text', e.target.value)}
                  placeholder="Enter your question"
                  required
                />
              </div>
              <div className="form-group">
                <label>Explanation</label>
                <textarea
                  value={q.explanation}
                  onChange={(e) => handleQuestionChange(index, 'explanation', e.target.value)}
                  placeholder="Enter explanation for the correct answer"
                  required
                />
              </div>
              <div className="options-container">
                <div className="options-header">
                  <label>Options</label>
                  <div className="option-controls">
                    <button 
                      type="button" 
                      onClick={() => handleAddOption(index)}
                      disabled={q.options.length >= 5}
                      className="option-control-btn"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveOption(index)}
                      disabled={q.options.length <= 2}
                      className="option-control-btn"
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                  </div>
                </div>
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
                      checked={q.correct_answer_index === oIndex}
                      onChange={() => handleQuestionChange(index, 'correct_answer_index', oIndex)}
                      required
                    />
                    <label>Correct</label>
                  </div>
                ))}
              </div>
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