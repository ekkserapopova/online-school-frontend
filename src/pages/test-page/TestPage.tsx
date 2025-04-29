// src/components/TestPage.tsx
import React, { useState, useEffect } from 'react';
import ProgressBar from '../../components/test/progress-bar/ProgressBar';
import TestTabs from '../../components/test/tabs/TestTabs';
import QuizQuestion from '../../components/test/question/TestQuestion';
import './TestPage.css';
import Navibar from '../../components/navbar/Navibar';
import api from '../../modules/login';
import { Question, Test } from '../../modules/test';
import { useNavigate } from 'react-router-dom';

// Компонент таймера
const Timer: React.FC<{ initialTime: number; onTimeEnd: () => void }> = ({ initialTime, onTimeEnd }) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeEnd();
      return;
    }
    
    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timerId);
  }, [timeLeft, onTimeEnd]);
  
  // Функция форматирования времени в MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Вычисление процента оставшегося времени для градиента
  const timePercentage = (timeLeft / initialTime) * 100;
  
  // Определение цвета таймера в зависимости от оставшегося времени
  let timerColor = 'green';
  if (timePercentage < 50) timerColor = 'orange';
  if (timePercentage < 20) timerColor = 'red';
  
  return (
    <div className="timer-container">
      <div className="timer" style={{ color: timerColor }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span className="timer-text">{formatTime(timeLeft)}</span>
      </div>
    </div>
  );
};

const TestPage: React.FC = () => {
  // Состояние для загруженных вопросов теста
  const [questionsData, setQuestionsData] = useState<Question[]>([]);
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Состояние для отслеживания текущего вопроса
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Состояние для хранения ответов пользователя (массивы выбранных ID для каждого вопроса)
  const [userAnswers, setUserAnswers] = useState<number[][]>([]);
  
  // Состояние для модального окна завершения теста
  const [showFinishModal, setShowFinishModal] = useState(false);
  
  // Состояние для отображения результатов (массив баллов)
  const [testPoints, setTestPoints] = useState<number[] | null>(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  
  // Состояние для таймера (время в секундах)
  const [testTime, setTestTime] = useState<number>(10); // По умолчанию 30 минут
  
  const testID = Number(window.location.pathname.split('/').pop());
  
  // Хук для навигации
  const navigate = useNavigate();

  // Загрузка теста при монтировании компонента
  useEffect(() => {
    getTest();
  }, []);

  // Функция для загрузки теста из API
  const getTest = async () => {
    try {
      setLoading(true);
      console.log('Загрузка теста...');
      const response = await api.get(`/course/1/test/${testID}`);
      const testData = response.data.test;
      setTest(testData);
      
      // Устанавливаем время теста, если оно указано в данных с сервера
      if (testData.time_limit && typeof testData.time_limit === 'number') {
        setTestTime(testData.time_limit * 60); // Предполагаем, что время с сервера приходит в минутах
      }
      
      // Проверяем, что questions существует и это массив
      const questions = Array.isArray(testData.questions) ? testData.questions : [];
      console.log('Вопросы:', questions);
      
      setQuestionsData(questions);
      // Инициализация массива ответов после загрузки вопросов
      setUserAnswers(Array(questions.length).fill([]));
      setLoading(false);
    } catch (error) {
      console.error('Ошибка получения теста', error);
      setError('Не удалось загрузить тест. Пожалуйста, попробуйте позже.');
      setLoading(false);
    }
  };

  const postAnswers = async (questionId: number, answerIds: number[]) => {
    try {
      const data = JSON.stringify({ selected_answer_ids: answerIds });
      const response = await api.post(`/question/${questionId}`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Ответы успешно отправлены:', response.data);
      return true;
    } catch (error) {
      console.error('Ошибка при отправке ответов:', error);
      alert('Не удалось отправить ответы. Пожалуйста, попробуйте позже.');
      return false;
    }
  };

  // Функция для получения результатов теста
  const getTestResults = async () => {
    try {
      const response = await api.get(`/test/${test?.id}/result`);
      // Получаем массив баллов
      const points = response.data.points;
      console.log('Баллы за тест:', points);
      return points;
    } catch (error) {
      console.error('Ошибка при получении результатов теста:', error);
      return []; // Возвращаем пустой массив в случае ошибки
    }
  };
  
  // Обработчик выбора/отмены ответа
  const handleSelectAnswer = (answerId: number) => {
    const newAnswers = [...userAnswers];
    const currentAnswers = [...(newAnswers[currentQuestionIndex] || [])];
    
    // Если ответ уже выбран - удаляем его, иначе добавляем
    if (currentAnswers.includes(answerId)) {
      newAnswers[currentQuestionIndex] = currentAnswers.filter(id => id !== answerId);
    } else {
      currentAnswers.push(answerId);
      newAnswers[currentQuestionIndex] = currentAnswers;
    }
    
    setUserAnswers(newAnswers);
  };
  
  // Обработчик перехода к следующему вопросу
  const handleNextQuestion = async () => {
    const currentQuestionId = questionsData[currentQuestionIndex]?.id;
    const selectedAnswerIds = userAnswers[currentQuestionIndex] || [];
    console.log('Выбранные ID ответов:', selectedAnswerIds);
    // Проверяем, выбран ли хотя бы один ответ перед отправкой
    if (currentQuestionId && selectedAnswerIds.length > 0) {
      // Отправляем ответы на сервер
      const success = await postAnswers(currentQuestionId, selectedAnswerIds);
      
      // Переходим к следующему вопросу, если отправка успешна
      if (success && currentQuestionIndex < questionsData.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    } else {
      // Если ответ не выбран, предупреждаем пользователя
      alert('Пожалуйста, выберите хотя бы один вариант ответа.');
    }
  };
  
  // Обработчик пропуска вопроса
  const handleSkipQuestion = () => {
    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  // Обработчик завершения теста
  const handleFinishTest = async () => {
    try {
      setLoading(true); // Включаем индикатор загрузки

      const res = await api.put(`/test/${test?.id}/finish`)
      console.log('Тест завершен');
      
      const points = await getTestResults();
      setTestPoints(points);
      
      // Закрываем модальное окно подтверждения
      setShowFinishModal(false);
      
      // Показываем модальное окно с результатами
      setShowResultsModal(true);
      
      setLoading(false); // Отключаем индикатор загрузки
      navigate(`/test/results/${testID}`); // Перенаправляем на страницу результатов

    } catch (error) {
      console.error('Ошибка при завершении теста:', error);
      alert('Произошла ошибка при завершении теста. Пожалуйста, попробуйте позже.');
      setLoading(false);
    }
  };
  
  // Обработчик перехода к курсу после завершения теста
  const handleGoToCourse = () => {
    // Навигация на страницу курса
    navigate('/course/1'); 
  };
  
  // Обработчик окончания времени таймера
  const handleTimeEnd = () => {
    // Показываем модальное окно с уведомлением
    alert('Время вышло! Тест будет автоматически завершен.');
    // Завершаем тест
    handleFinishTest();
  };
  
  // Вычисление прогресса - вопросы, на которые дан хотя бы один ответ
  const progress = userAnswers.filter(answers => answers && answers.length > 0).length;

  // Адаптация для компонента QuizQuestion, преобразуя структуру вопроса
  const adaptQuestionForComponent = (question: Question) => {
    try {
      // Проверяем, что answers существует и это массив
      const answers = Array.isArray(question.answers) ? question.answers : [];
      
      return {
        id: question.id,
        text: question.text,
        options: answers.map(answer => answer?.text || ''),
        answerIds: answers.map(answer => answer?.id || 0)
      };
    } catch (error) {
      console.error("Ошибка при адаптации вопроса:", error);
      return {
        id: question?.id || 0,
        text: question?.text || "Ошибка загрузки вопроса",
        options: [],
        answerIds: []
      };
    }
  };

  // Функция для получения массива выбранных текстов ответов
  const getSelectedAnswerTexts = () => {
    const currentAnswers = userAnswers[currentQuestionIndex] || [];
    if (currentAnswers.length === 0) return [];
    
    const answers = Array.isArray(currentQuestion.answers) ? currentQuestion.answers : [];
    return currentAnswers
      .map(id => {
        const answer = answers.find(a => a?.id === id);
        return answer?.text || '';
      })
      .filter(text => text !== ''); // Отфильтровываем пустые тексты
  };
  
  // Функция для нахождения ID ответа по тексту
  const findAnswerIdByText = (text: string) => {
    const answers = Array.isArray(currentQuestion.answers) ? currentQuestion.answers : [];
    const answer = answers.find(a => a?.text === text);
    return answer?.id;
  };

  // Отображение загрузки
  if (loading) {
    return <div className="loading">Загрузка теста...</div>;
  }

  // Отображение ошибки
  if (error) {
    return <div className="error">{error}</div>;
  }

  // Проверка наличия вопросов
  if (questionsData.length === 0) {
    return <div className="no-questions">Тест не содержит вопросов.</div>;
  }
  
  // Безопасно получаем текущий вопрос
  const currentQuestion = questionsData[currentQuestionIndex] || {
    id: 0,
    text: 'Вопрос не найден',
    test_id: 0,
    answers: [],
    srudent_answers: [],
    points: 0
  };
  
  const adaptedQuestion = adaptQuestionForComponent(currentQuestion);
  
  return (
    <>
      <Navibar />
      <div className="quiz-app">
        <div className="quiz-header">
          <ProgressBar 
            total={questionsData.length} 
            completed={progress} 
          />
          {/* Таймер теста */}
          <Timer 
            initialTime={testTime} 
            onTimeEnd={handleTimeEnd} 
          />
        </div>
        
        <TestTabs 
          questions={questionsData.map(q => ({ id: q.id || 0, text: q.text || '' }))}
          currentIndex={currentQuestionIndex}
          answeredQuestions={userAnswers.map(answers => answers && answers.length > 0)} 
        />
        
        <QuizQuestion 
          question={adaptedQuestion}
          selectedAnswerIds={userAnswers[currentQuestionIndex] || []} // Передаем непосредственно массив ID
          onSelectAnswer={(answerId) => {
            handleSelectAnswer(answerId); // Теперь напрямую принимаем ID ответа
          }}
          onRecordAnswer={handleNextQuestion}
          isLastQuestion={currentQuestionIndex === questionsData.length - 1}
        />
        
        {/* Кнопки для пропуска вопроса и завершения теста */}
        <div className="quiz-actions">
          <button 
            className="skip-button" 
            onClick={handleSkipQuestion}
            disabled={currentQuestionIndex === questionsData.length - 1}
          >
            Пропустить вопрос
          </button>
          <button 
            className="finish-button" 
            onClick={() => setShowFinishModal(true)}
          >
            Завершить тест
          </button>
        </div>
        
        {/* Модальное окно для подтверждения завершения теста */}
        {showFinishModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Завершить тест?</h3>
              <p>Вы ответили на {progress} из {questionsData.length} вопросов.</p>
              <div className="modal-buttons">
                <button 
                  className="cancel-button"
                  onClick={() => setShowFinishModal(false)}
                >
                  Отмена
                </button>
                <button 
                  className="confirm-button"
                  onClick={handleFinishTest}
                >
                  Завершить
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Модальное окно с результатами теста */}
        {showResultsModal && testPoints !== null && (
          <div className="modal-overlay">
            <div className="modal-content results-modal">
              <h3>Результаты теста</h3>
              <div className="test-results">
                {/* Показываем баллы за каждый вопрос */}
                <p>Ваши результаты:</p>
                <ul className="points-list">
                  {testPoints.map((point, index) => (
                    <li key={index}>
                      <strong>Вопрос {index + 1}:</strong> {point} баллов
                    </li>
                  ))}
                </ul>
                {/* Общая сумма баллов */}
                <p className="total-points">
                  Общий результат: <strong>{testPoints.reduce((sum, point) => sum + point, 0)}</strong> баллов
                </p>
              </div>
              <div className="modal-buttons">
                <button 
                  className="confirm-button"
                  onClick={handleGoToCourse}
                >
                  Вернуться к курсу
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TestPage;