import React, { useState, useEffect } from 'react';
import './TestQuestionManager.css';
import { Question } from '../../../../../modules/test';
import '../../Buttons.css'
import AnswerManager from '../answer/AddAnswer';
import axios from 'axios';
import { FiTrash } from 'react-icons/fi';

interface QuestionManagerProps {
  moduleId: number;
  isTeacher?: boolean;
}

const QuestionManager: React.FC<QuestionManagerProps> = ({ 
  moduleId, 
  isTeacher = true 
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);
  const [showQuestionsList, setShowQuestionsList] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [editingQuestionText, setEditingQuestionText] = useState('');

  // Restore scroll position and expanded questions when component mounts
  useEffect(() => {
    // Restore scroll position
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(scrollPosition));
      }, 100);
    }
    
    // Restore expanded questions
    const storedExpandedQuestions = sessionStorage.getItem('expandedQuestions');
    if (storedExpandedQuestions) {
      try {
        const expandedQuestionsObj = JSON.parse(storedExpandedQuestions);
        // Convert object keys to numbers and filter only true values
        const questionIds = Object.keys(expandedQuestionsObj)
          .filter(id => expandedQuestionsObj[id])
          .map(id => parseInt(id))
          .filter(id => !isNaN(id));
        
        setExpandedQuestions(questionIds);
        
        // If we have expanded questions, auto-show the questions list
        if (questionIds.length > 0) {
          setShowQuestionsList(true);
        }
      } catch (error) {
        console.error('Error parsing expandedQuestions from sessionStorage:', error);
      }
    }
    
    // Clean up sessionStorage after restoring
    sessionStorage.removeItem('scrollPosition');
    // We'll keep expandedQuestions for now
  }, []);
  
  // Save expanded questions state when it changes
  useEffect(() => {
    if (expandedQuestions.length > 0) {
      const expandedQuestionsObj: Record<number, boolean> = {};
      expandedQuestions.forEach(id => {
        expandedQuestionsObj[id] = true;
      });
      sessionStorage.setItem('expandedQuestions', JSON.stringify(expandedQuestionsObj));
    }
  }, [expandedQuestions]);

  // Fetch questions when component mounts
  useEffect(() => {
    if (moduleId) {
      fetchQuestions();
    }
  }, [moduleId]);

  const fetchQuestions = async () => {
    try {
      const authToken = localStorage.getItem('auth_token');
      const response = await axios.get(
        `http://localhost:8080/api/module/${moduleId}/questions`,
        {
          headers: {
        Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      // Mock data for development
      setQuestions([]);
    }
  };

  const toggleQuestionsList = () => {
    setShowQuestionsList(!showQuestionsList);
  };

  // Add this to AddQuestion.tsx
const closeQuestion = (questionId: number) => {
  // Save scroll position
  sessionStorage.setItem('scrollPosition', window.scrollY.toString());
  
  // Remove the question from expanded list
  const newExpandedQuestions = expandedQuestions.filter(id => id !== questionId);
  setExpandedQuestions(newExpandedQuestions);
  
  // Update the expandedQuestions in sessionStorage
  const expandedQuestionsObj: Record<number, boolean> = {};
  newExpandedQuestions.forEach(id => {
    expandedQuestionsObj[id] = true;
  });
  sessionStorage.setItem('expandedQuestions', JSON.stringify(expandedQuestionsObj));
};

  const toggleExpandQuestion = (questionId: number) => {
    // Save scroll position when toggling
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    
    // Toggle the question's expanded state
    const newExpandedQuestions = expandedQuestions.includes(questionId)
      ? expandedQuestions.filter(id => id !== questionId)
      : [...expandedQuestions, questionId];
    
    setExpandedQuestions(newExpandedQuestions);
    
    // Update the expandedQuestions object in sessionStorage
    const expandedQuestionsObj: Record<number, boolean> = {};
    newExpandedQuestions.forEach(id => {
      expandedQuestionsObj[id] = true;
    });
    sessionStorage.setItem('expandedQuestions', JSON.stringify(expandedQuestionsObj));
  };

  const handleAddQuestion = async () => {
    if (!newQuestionText.trim()) return;
    
    // Save scroll position before API call
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    
    try {
      const authToken = localStorage.getItem('auth_token');
      const response = await axios.post(
        `http://localhost:8080/api/module/${moduleId}/questions`,
        {
          text: newQuestionText,
          module_id: moduleId,
          points: 1, // Default points value
          test_id: null
        },
        {
          headers: {
        Authorization: `Bearer ${authToken}`,
          },
        }
      );
      
      if (response.data) {
        const newQuestion = response.data;
        setQuestions([...questions, newQuestion]);
        setNewQuestionText('');
        setIsAddingQuestion(false);
        
        // Auto-expand the newly added question and save expanded state
        const newExpandedQuestions = [...expandedQuestions, newQuestion.id];
        setExpandedQuestions(newExpandedQuestions);
        
        const expandedQuestionsObj: Record<number, boolean> = {};
        newExpandedQuestions.forEach(id => {
          expandedQuestionsObj[id] = true;
        });
        sessionStorage.setItem('expandedQuestions', JSON.stringify(expandedQuestionsObj));
      }
    } catch (error) {
      console.error('Failed to add question:', error);
      // Mock response for development
      const mockQuestion: Question = {
        id: Math.floor(Math.random() * 10000),
        text: newQuestionText,
        test_id: 0, // Not tied to a test
        answers: [],
        srudent_answers: [],
        points: 1
      };
      setQuestions([...questions, mockQuestion]);
      setNewQuestionText('');
      setIsAddingQuestion(false);
      
      // Auto-expand the newly added question and save expanded state
      const newExpandedQuestions = [...expandedQuestions, mockQuestion.id];
      setExpandedQuestions(newExpandedQuestions);
      
      const expandedQuestionsObj: Record<number, boolean> = {};
      newExpandedQuestions.forEach(id => {
        expandedQuestionsObj[id] = true;
      });
      sessionStorage.setItem('expandedQuestions', JSON.stringify(expandedQuestionsObj));
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    // Save scroll position before deletion
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    
    try {
      const authToken = localStorage.getItem('auth_token');
      await axios.delete(
        `http://localhost:8080/api/modules/${moduleId}/questions/${questionId}`,
        {
          headers: {
        Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setQuestions(questions.filter(q => q.id !== questionId));
      // Remove from expanded list if it was expanded
      setExpandedQuestions(expandedQuestions.filter(id => id !== questionId));
      
      // Update expandedQuestions in sessionStorage
      const expandedQuestionsObj: Record<number, boolean> = {};
      expandedQuestions
        .filter(id => id !== questionId)
        .forEach(id => {
          expandedQuestionsObj[id] = true;
        });
      sessionStorage.setItem('expandedQuestions', JSON.stringify(expandedQuestionsObj));
    } catch (error) {
      console.error('Failed to delete question:', error);
      // Mock delete for development
      setQuestions(questions.filter(q => q.id !== questionId));
      setExpandedQuestions(expandedQuestions.filter(id => id !== questionId));
      
      // Update expandedQuestions in sessionStorage
      const expandedQuestionsObj: Record<number, boolean> = {};
      expandedQuestions
        .filter(id => id !== questionId)
        .forEach(id => {
          expandedQuestionsObj[id] = true;
        });
      sessionStorage.setItem('expandedQuestions', JSON.stringify(expandedQuestionsObj));
    }
  };

  const startEditQuestion = (question: Question) => {
    // Save scroll position before editing
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    
    setEditingQuestionId(question.id);
    setEditingQuestionText(question.text);
  };

  const cancelEditQuestion = () => {
    setEditingQuestionId(null);
    setEditingQuestionText('');
  };

  const saveEditQuestion = async (questionId: number) => {
    if (!editingQuestionText.trim()) return;

    // Save scroll position and question expanded state
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    
    const expandedQuestionsObj: Record<number, boolean> = {};
    expandedQuestions.forEach(id => {
      expandedQuestionsObj[id] = true;
    });
    sessionStorage.setItem('expandedQuestions', JSON.stringify(expandedQuestionsObj));
    
    try {
      const authToken = localStorage.getItem('auth_token');
      const response = await axios.put(
        `http://localhost:8080/api/modules/${moduleId}/questions/${questionId}`,
        { text: editingQuestionText },
        {
          headers: {
        Authorization: `Bearer ${authToken}`,
          },
        }
      );
      
      setQuestions(questions.map(q => 
        q.id === questionId ? { ...q, text: editingQuestionText } : q
      ));
      cancelEditQuestion();
    } catch (error) {
      console.error('Failed to update question:', error);
      // Mock update for development
      setQuestions(questions.map(q => 
        q.id === questionId ? { ...q, text: editingQuestionText } : q
      ));
      cancelEditQuestion();
    }
  };

  // Rest of the component remains the same
  return (
    <div className="question-manager">
      {/* Your existing JSX */}
      {isTeacher && (
        <div className="question-controls">
          {!isAddingQuestion ? (
            <button 
              className="add-question-btn" 
              onClick={() => setIsAddingQuestion(true)}
            >
              Добавить вопрос
            </button>
          ) : (
            <div className="add-question-form">
              <textarea
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Введите текст вопроса"
                rows={3}
              />
              <div className="question-form-controls">
                <button onClick={handleAddQuestion} className="action-button action-button--primary">Сохранить</button>
                <button onClick={() => setIsAddingQuestion(false)} className="action-button action-button--cancel">Отмена</button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="questions-section">
        <button 
          className="toggle-questions-list" 
          onClick={toggleQuestionsList}
        >
          {showQuestionsList ? 'Скрыть вопросы' : 'Показать вопросы'} ({questions.length})
        </button>

        {showQuestionsList && (
          <div className="questions-list">
            {questions.length === 0 ? (
              <p className="no-questions">Вопросов пока нет</p>
            ) : (
              questions.map(question => (
                <div key={question.id} className="question-item">
                  <div className="question-header">
                    {editingQuestionId === question.id ? (
                      <div className="edit-question-form">
                        <textarea
                          value={editingQuestionText}
                          onChange={(e) => setEditingQuestionText(e.target.value)}
                          rows={2}
                        />
                        <div className="question-edit-controls">
                          <button onClick={() => saveEditQuestion(question.id)} className="action-button action-button--primary">Сохранить</button>
                          <button onClick={cancelEditQuestion}>Отмена</button>
                        </div>
                      </div>
                    ) : (
                      <div className="question-title">
                        <span onClick={() => toggleExpandQuestion(question.id)}>
                          {expandedQuestions.includes(question.id) ? '▼' : '►'} {question.text}
                        </span>
                        {isTeacher && (
                          <div className="question-actions">
                            <button onClick={() => startEditQuestion(question)}>
                              Редактировать
                            </button>
                            <button onClick={() => handleDeleteQuestion(question.id)}>
                               <FiTrash size={18} color='red'/>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {expandedQuestions.includes(question.id) && (
                    <AnswerManager 
                      question={question}
                      moduleId={moduleId}
                      updateQuestion={(updatedQuestion) => {
                        setQuestions(questions.map(q => 
                          q.id === updatedQuestion.id ? updatedQuestion : q
                        ));
                      }}
                      isTeacher={isTeacher}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionManager;