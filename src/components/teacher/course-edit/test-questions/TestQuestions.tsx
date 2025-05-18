import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TestQuestions.css';
import { Question, AnswerVariant } from '../../../../modules/test';

interface TestQuestionsProps {
  testId: string;
}

const TestQuestions: React.FC<TestQuestionsProps> = ({ testId }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, [testId]);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(
        `http://localhost:8080/api/tests/${testId}/questions`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('Ответ API вопросов:', response.data);
      
      // Адаптируем данные к нашей структуре
      const questions = response.data.questions || [];
      setQuestions(questions);
    } catch (err) {
      console.error('Ошибка при загрузке вопросов:', err);
      setError('Не удалось загрузить вопросы. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="test-questions__loading">Загрузка вопросов...</div>;
  }

  if (error) {
    return <div className="test-questions__error">{error}</div>;
  }

  if (questions.length === 0) {
    return <div className="test-questions__empty">У этого теста нет вопросов.</div>;
  }

  return (
    <div className="test-questions">
      <h5 className="test-questions__title">Вопросы теста:</h5>
      
      <div className="test-questions__list">
        {questions.map((question, index) => (
          <div key={question.id || index} className="test-question">
            <div className="test-question__header">
              <span className="test-question__number">Вопрос {index + 1}</span>
              <div className="test-question__text">{question.text}</div>
              {question.points > 0 && (
                <span className="test-question__points">
                  {question.points} балл{question.points > 1 ? (question.points < 5 ? 'а' : 'ов') : ''}
                </span>
              )}
            </div>
            
            {question.answers && question.answers.length > 0 ? (
              <ul className="test-question__options">
                {question.answers.map((answer, answerIndex) => (
                  <li 
                    key={answer.id || answerIndex} 
                    className={`test-question__option ${answer.is_right ? 'test-question__option--correct' : ''}`}
                  >
                    <span className="test-question__option-marker">
                      {answer.is_right ? '✓' : '○'}
                    </span>
                    <span className="test-question__option-text">{answer.text}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="test-question__no-options">
                У этого вопроса нет вариантов ответа.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestQuestions;