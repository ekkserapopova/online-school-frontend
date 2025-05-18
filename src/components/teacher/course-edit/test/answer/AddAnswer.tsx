import React, { useState, useEffect } from 'react';
import './AnswerManager.css';
import { AnswerVariant, Question } from '../../../../../modules/test';
import axios from 'axios';
import { FiTrash } from 'react-icons/fi';

interface AnswerManagerProps {
  question: Question;
  moduleId: number;
  updateQuestion: (updatedQuestion: Question) => void;
  isTeacher?: boolean;
}

// Helper functions for handling state persistence
const saveScrollPosition = () => {
  const scrollPosition = window.scrollY;
  sessionStorage.setItem('scrollPosition', scrollPosition.toString());
};

const saveExpandedState = (questionId: number) => {
  const expandedQuestions = JSON.parse(sessionStorage.getItem('expandedQuestions') || '{}');
  
  // Only save the current question's expanded state, don't affect others
  if (questionId) {
    expandedQuestions[questionId] = true;
    sessionStorage.setItem('expandedQuestions', JSON.stringify(expandedQuestions));
  }
};

const AnswerManager: React.FC<AnswerManagerProps> = ({ 
  question, 
  moduleId,
  updateQuestion,
  isTeacher = true
}) => {
  const [newAnswerText, setNewAnswerText] = useState('');
  const [isAddingAnswer, setIsAddingAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [editingAnswerId, setEditingAnswerId] = useState<number | null>(null);
  const [editingAnswerText, setEditingAnswerText] = useState('');
  const [editingAnswerCorrect, setEditingAnswerCorrect] = useState(false);
  // Add local state to track answers
  const [localAnswers, setLocalAnswers] = useState<AnswerVariant[]>(question.answers || []);
  
  // Sync local answers with question.answers whenever they change
  useEffect(() => {
    setLocalAnswers(question.answers || []);
  }, [question.answers]);
  
  const handleAddAnswer = async () => {
    if (!newAnswerText.trim()) return;
    
    // Save scroll position and expanded state before API call
    saveScrollPosition();
    saveExpandedState(question.id);
    
    try {
      const response = await axios.post(
        `http://localhost:8080/api/questions/${question.id}/answers`,
        {
          text: newAnswerText,
          is_right: isCorrect,
          number_id: (localAnswers.length || 0) + 1,
          module_id: moduleId
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      );
      
      if (response.data) {
        const newAnswer = response.data;
        
        // Update local state immediately
        const updatedAnswers = [...localAnswers, newAnswer];
        setLocalAnswers(updatedAnswers);
        
        // Update parent component
        const updatedQuestion = {
          ...question,
          answers: updatedAnswers
        };
        updateQuestion(updatedQuestion);
        
        // Reset form
        setNewAnswerText('');
        setIsCorrect(false);
        setIsAddingAnswer(false);
      }
      window.location.reload();
    } catch (error) {
      console.error('Failed to add answer:', error);
      // Mock response for development
      const mockAnswer: AnswerVariant = {
        id: Math.floor(Math.random() * 10000),
        number_id: (localAnswers.length || 0) + 1,
        text: newAnswerText,
        question_id: question.id,
        is_right: isCorrect
      };
      
      // Update local state immediately
      const updatedAnswers = [...localAnswers, mockAnswer];
      setLocalAnswers(updatedAnswers);
      
      // Update parent component
      const updatedQuestion = {
        ...question,
        answers: updatedAnswers
      };
      updateQuestion(updatedQuestion);
      
      // Reset form
      setNewAnswerText('');
      setIsCorrect(false);
      setIsAddingAnswer(false);
    }
  };

  const handleDeleteAnswer = async (answerId: number) => {
    // Save scroll position and expanded state before API call
    saveScrollPosition();
    saveExpandedState(question.id);
    
    try {
      await axios.delete(
        `http://localhost:8080/api/modules/${moduleId}/questions/${question.id}/answers/${answerId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      );
      const updatedAnswers = localAnswers.filter(a => a.id !== answerId);
      setLocalAnswers(updatedAnswers);
      updateQuestion({ ...question, answers: updatedAnswers });
    } catch (error) {
      console.error('Failed to delete answer:', error);
      // Mock delete for development
      const updatedAnswers = localAnswers.filter(a => a.id !== answerId);
      setLocalAnswers(updatedAnswers);
      updateQuestion({ ...question, answers: updatedAnswers });
    }
  };

  const startEditAnswer = (answer: AnswerVariant) => {
    setEditingAnswerId(answer.id);
    setEditingAnswerText(answer.text);
    setEditingAnswerCorrect(answer.is_right);
  };

  const cancelEditAnswer = () => {
    setEditingAnswerId(null);
    setEditingAnswerText('');
    setEditingAnswerCorrect(false);
  };

  const saveEditAnswer = async (answerId: number) => {
    if (!editingAnswerText.trim()) return;
    
    // Save scroll position and expanded state before API call
    saveScrollPosition();
    saveExpandedState(question.id);
    
    try {
      const response = await axios.put(
        `http://localhost:8080/api/modules/${moduleId}/questions/${question.id}/answers/${answerId}`,
        {
          text: editingAnswerText,
          is_right: editingAnswerCorrect
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      );
      
      const updatedAnswers = localAnswers.map(a => 
        a.id === answerId 
          ? { ...a, text: editingAnswerText, is_right: editingAnswerCorrect } 
          : a
      );
      
      setLocalAnswers(updatedAnswers);
      updateQuestion({ ...question, answers: updatedAnswers });
      cancelEditAnswer();
      window.location.reload();
    } catch (error) {
      console.error('Failed to update answer:', error);
      // Mock update for development
      const updatedAnswers = localAnswers.map(a => 
        a.id === answerId 
          ? { ...a, text: editingAnswerText, is_right: editingAnswerCorrect } 
          : a
      );
      setLocalAnswers(updatedAnswers);
      updateQuestion({ ...question, answers: updatedAnswers });
      cancelEditAnswer();
    }
  };

  return (
    <div className="answer-manager">
      {/* Rest of your component remains the same */}
      <h4>Варианты ответов:</h4>
      {localAnswers.length > 0 ? (
        <ul className="answers-list">
          {localAnswers.map((answer) => (
            <li key={answer.id} className="answer-item">
              {editingAnswerId === answer.id ? (
                <div className="edit-answer-form">
                  <input
                    type="text"
                    value={editingAnswerText}
                    onChange={(e) => setEditingAnswerText(e.target.value)}
                  />
                  <div className="answer-edit-controls">
                    <label>
                      <input
                        type="checkbox"
                        checked={editingAnswerCorrect}
                        onChange={(e) => setEditingAnswerCorrect(e.target.checked)}
                      />
                      Правильный ответ
                    </label>
                    <button className="action-button action-button--primary" onClick={() => saveEditAnswer(answer.id)}>Сохранить</button>
                    <button className="action-button action-button--cancel" onClick={cancelEditAnswer}>Отмена</button>
                  </div>
                </div>
              ) : (
                <div className={`answer-content ${answer.is_right ? 'correct-answer' : ''}`}>
                  <span className="answer-text">
                    {answer.text} {answer.is_right && '✓'}
                  </span>
                  {isTeacher && (
                    <div className="answer-actions">
                      <button onClick={() => startEditAnswer(answer)}>
                        Редактировать
                      </button>
                      <button onClick={() => handleDeleteAnswer(answer.id)}>
                        <FiTrash size={18} color='red' />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-answers">Нет вариантов ответов</p>
      )}

      {isTeacher && (
        <div className="add-answer-section">
          {!isAddingAnswer ? (
            <button 
              className="add-answer-btn" 
              onClick={() => setIsAddingAnswer(true)}
            >
              Добавить вариант ответа
            </button>
          ) : (
            <div className="add-answer-form">
              <input
                type="text"
                value={newAnswerText}
                onChange={(e) => setNewAnswerText(e.target.value)}
                placeholder="Введите текст ответа"
                autoFocus
              />
              <div className="answer-form-controls">
                <label>
                  <input
                    type="checkbox"
                    checked={isCorrect}
                    onChange={(e) => setIsCorrect(e.target.checked)}
                  />
                  Правильный ответ
                </label>
                <button onClick={handleAddAnswer}>Добавить</button>
                <button onClick={() => setIsAddingAnswer(false)}>Отмена</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnswerManager;