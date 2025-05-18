import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navibar from '../../components/navbar/Navibar';
import './TeacherTestResultsPage.css';
import { Test } from '../../modules/test';

export interface CompletedTests {
  id: number;
  test_id: number;
  student_id: number;
  points: number;
  status: string;
  created_at: string;
  updated_at: string;
  student_name?: string;
  student_surname?: string;
}


interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="error-message">
      <p>{message}</p>
    </div>
  );
};

const Loader: React.FC = () => {
  return (
    <div className="loader">
      <div className="loader__spinner"></div>
      <p>Загрузка данных...</p>
    </div>
  );
};

const TeacherTestResultsPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  
  const [test, setTest] = useState<Test | null>(null);
  const [completedTests, setCompletedTests] = useState<CompletedTests[]>([]);
  const [selectedResult, setSelectedResult] = useState<CompletedTests | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Получение информации о тесте
  const getTestInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/tests/${testId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      );
      setTest(response.data.test);
    } catch (error) {
      console.error('Ошибка при получении данных теста:', error);
      setError('Не удалось загрузить информацию о тесте');
    }
  };

  // Получение всех результатов теста
  const getTestResults = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/tests/${testId}/results`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      );
      
      // Debug the response structure
      console.log('API response:', response.data);
      
      // Check if students_tests exists and is an array
      if (response.data && response.data.students_tests) {
        console.log('students_tests type:', typeof response.data.students_tests);
      } else {
        console.log('Response structure:', Object.keys(response.data));
      }
      
      // Safely extract the array of test results, with fallbacks
      const testResults = Array.isArray(response.data.students_tests) 
        ? response.data.students_tests 
        : (Array.isArray(response.data.results) 
          ? response.data.results 
          : []);
          
      setCompletedTests(testResults);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при получении результатов теста:', error);
      setError('Не удалось загрузить результаты теста');
      setLoading(false);
    }
  };

  // Форматирование даты
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Получение отфильтрованных и отсортированных результатов
  const getFilteredResults = () => {
    // Add additional safety check to ensure completedTests is an array
    if (!Array.isArray(completedTests)) {
      return [];
    }
    
    return completedTests
      .filter(result => {
        // Фильтрация по статусу
        if (filterStatus !== 'all' && result.status !== filterStatus) {
          return false;
        }
        
        // Фильтрация по поисковому запросу
        if (searchQuery) {
          const fullName = `${result.student_name || ''} ${result.student_surname || ''}`.toLowerCase();
          return fullName.includes(searchQuery.toLowerCase());
        }
        
        return true;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  // Выбор результата студента
  const handleSelectResult = (result: CompletedTests) => {
    setSelectedResult(result);
  };

  // Получение класса для статуса
  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'failed': return 'status-failed';
      case 'in_progress': return 'status-in-progress';
      default: return '';
    }
  };

  // Получение текста статуса
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'completed': return 'Пройден';
      case 'failed': return 'Не пройден';
      case 'in_progress': return 'В процессе';
      default: return 'Неизвестно';
    }
  };

  // Получение процента правильных ответов
  const getScorePercentage = (points: number): number => {
    // Use count_questions as a fallback for max points
    const maxPoints = test?.count_questions || 0;
    if (maxPoints === 0) return 0;
    return Math.round((points / maxPoints) * 100);
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    getTestInfo();
    getTestResults();
  }, [testId]);

  return (
    <div className="teacher-test-results">
      <Navibar />
      
      <div className="teacher-test-results__content">
        {loading ? (
          <div className="teacher-test-results__loading">
            <Loader />
          </div>
        ) : error ? (
          <div className="teacher-test-results__error">
            <ErrorMessage message={error} />
          </div>
        ) : (
          <>
            <div className="teacher-test-results__header">
              <div className="teacher-test-results__title-section">
                <h1 className="teacher-test-results__title">{test?.name}</h1>
                <p className="teacher-test-results__description">{test?.description}</p>
                <div className="teacher-test-results__meta">
                  {/* <span className="teacher-test-results__points">Максимальный балл: {test?.max_points}</span> */}
                  {test?.deadline && (
                    <span className="teacher-test-results__deadline">Дедлайн: {formatDate(test.deadline)}</span>
                  )}
                </div>
              </div>
              
            </div>

            <div className="teacher-test-results__container">
              <div className="teacher-test-results__results-list">
                <h2 className="teacher-test-results__section-title">Результаты студентов</h2>
                
                {getFilteredResults().length === 0 ? (
                  <div className="teacher-test-results__empty-list">
                    Нет результатов 
                  </div>
                ) : (
                  <ul className="student-results-list">
                    {getFilteredResults().map(result => (
                      <li 
                        key={result.id} 
                        className={`student-result-item ${selectedResult?.id === result.id ? 'student-result-item--active' : ''}`}
                        onClick={() => handleSelectResult(result)}
                      >
                        <div className="student-result-item__header">
                          <span className="student-result-item__name">
                            {result.student_name} {result.student_surname}
                          </span>
                          <span className={`student-result-item__status ${getStatusClass(result.status)}`}>
                            {getStatusText(result.status)}
                          </span>
                        </div>
                        
                        <div className="student-result-item__meta">
                          <span className="student-result-item__date">
                            {formatDate(result.created_at)}
                          </span>
                          <div className="student-result-item__score">
                            <div className="student-result-item__score-text">
                              Баллы: {result.points} / {test?.count_questions}
                            </div>
                            
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div className="teacher-test-results__details">
                {selectedResult ? (
                  <div className="result-details">
                    <div className="result-details__header">
                      <h2 className="result-details__title">
                        Результат: {selectedResult.student_name} {selectedResult.student_surname}
                      </h2>
                      <div className={`result-details__status ${getStatusClass(selectedResult.status)}`}>
                        {getStatusText(selectedResult.status)}
                      </div>
                    </div>
                    
                    <div className="result-details__score-section">
                      <div className="result-details__score-header">
                        <h3 className="result-details__subtitle">Результат</h3>
                        <div className="result-details__points">
                          {selectedResult.points} / {test?.count_questions} баллов
                        </div>
                      </div>
                      
                      <div className="result-details__score-bar">
                        <div 
                          className="result-details__score-progress" 
                          style={{ width: `${getScorePercentage(selectedResult.points)}%` }}
                        ></div>
                      </div>
                      <div className="result-details__score-percentage">
                        {getScorePercentage(selectedResult.points)}%
                      </div>
                    </div>
                    
                    <div className="result-details__dates">
                      <div className="result-details__date-item">
                        <span className="result-details__date-label">Начало теста:</span>
                        <span className="result-details__date-value">{formatDate(selectedResult.created_at)}</span>
                      </div>
                      <div className="result-details__date-item">
                        <span className="result-details__date-label">Завершение:</span>
                        <span className="result-details__date-value">{formatDate(selectedResult.updated_at)}</span>
                      </div>
                    </div>
                    
                  </div>
                ) : (
                  <div className="result-details__placeholder">
                    <div className="result-details__placeholder-icon">👈</div>
                    <p>Выберите результат студента из списка слева</p>
                  </div>
                )}
              </div>
            </div>
            
            
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherTestResultsPage;