import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navibar from '../../components/navbar/Navibar';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { python } from '@codemirror/lang-python';
import { EditorView } from '@codemirror/view';
import './TeacherTaskResultsPage.css';

// Интерфейсы данных
interface StudentTask {
  id: number;
  task_id: number;
  student_id: number;
  code: string;
  status: string;
  score: number | null;
  recommendation: string | null;
  created_at: string;
  code_with_comments_by_llm?: string;
  student_name?: string;
  student_surname?: string;
}

interface Task {
  id: number;
  name: string;
  description: string;
  template_code?: string;
  course_id: number;
  module_id: number;
  deadline?: string;
  is_active: boolean;
}

const TeacherTaskResultsPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  
  const [task, setTask] = useState<Task | null>(null);
  const [studentTasks, setStudentTasks] = useState<StudentTask[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState('');
  const [score, setScore] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [studentName, setStudentName] = useState<string>('');

  // Получение основной информации о задании
  const getTaskInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      );
      setTask(response.data.task);
    } catch (error) {
      console.error('Ошибка при получении данных задачи:', error);
      setError('Не удалось загрузить информацию о задании');
    }
  };

  const getStudentInfo = async (studentId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/user/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      );
      setStudentName(`${response.data.name} ${response.data.surname}`);
      return response.data.user;
    } catch (error) {
      console.error('Ошибка при получении информации о студенте:', error);
      setError('Не удалось загрузить информацию о студенте');
      return null;
    }
  };

  // Получение всех ответов студентов на это задание
  const getStudentTasks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/tasks/students/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      );
      setStudentTasks(response.data.task || []);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при получении ответов студентов:', error);
      setError('Не удалось загрузить ответы студентов');
      setLoading(false);
    }
  };

  // Отправка оценки и обратной связи
  const handleSubmitFeedback = async () => {
    if (!selectedStudent) return;
    
    setSubmitting(true);
    try {
      await axios.patch(
        `http://localhost:8080/api/tasks/${taskId}/answers/${selectedStudent.id}`,
        {
          score,
          recommendation,
          status: 'completed'
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      );
      
      // Обновление списка заданий
      getStudentTasks();
      setSubmitting(false);
    } catch (error) {
      console.error('Ошибка при отправке обратной связи:', error);
      setSubmitting(false);
    }
  };

  // Отклонение задания
  const handleRejectTask = async () => {
    if (!selectedStudent) return;
    
    setSubmitting(true);
    try {
      await axios.patch(
        `http://localhost:8080/api/tasks/${taskId}/answers/${selectedStudent.id}`,
        {
          score: 0,
          recommendation: recommendation || 'Задание не соответствует требованиям',
          status: 'canceled'
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      );
      
      // Обновление списка заданий
      getStudentTasks();
      setSubmitting(false);
    } catch (error) {
      console.error('Ошибка при отклонении задания:', error);
      setSubmitting(false);
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

  // Получение отфильтрованных и отсортированных заданий
  const getFilteredTasks = () => {
    return studentTasks
      .filter(task => {
        // Фильтрация по статусу
        if (filterStatus !== 'all' && task.status !== filterStatus) {
          return false;
        }
        
        // Фильтрация по поисковому запросу
        if (searchQuery) {
          const fullName = `${task.student_name} ${task.student_surname}`.toLowerCase();
          return fullName.includes(searchQuery.toLowerCase());
        }
        
        return true;
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  // Выбор задания студента
  const handleSelectStudent = (task: StudentTask) => {
    setSelectedStudent(task);
    getStudentInfo((task.student_id));
    setRecommendation(task.recommendation || '');
    setScore(task.score || 0);
  };

  // Получение класса для статуса
  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'in progress': return 'status-pending';
      case 'canceled': return 'status-rejected';
      case 'completed': return 'status-approved';
      default: return '';
    }
  };

  // Получение текста статуса
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'in progress': return 'На проверке';
      case 'canceled': return 'Отклонено';
      case 'completed': return 'Принято';
      default: return 'Неизвестно';
    }
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    getTaskInfo();
    getStudentTasks();
  }, [taskId]);

  return (
    <div className="teacher-task-results">
      <Navibar />
      
      <div className="teacher-task-results__content">
        {loading ? (
          <div className="teacher-task-results__loading">Загрузка результатов...</div>
        ) : error ? (
          <div className="teacher-task-results__error">{error}</div>
        ) : (
          <>
            <div className="teacher-task-results__header">
              <div className="teacher-task-results__title-section">
                <h1 className="teacher-task-results__title">{task?.name}</h1>
              </div>
              
              <div className="teacher-task-results__filters">
                {/* <div className="teacher-task-results__search">
                  <input
                    type="text"
                    placeholder="Поиск по имени студента..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="teacher-task-results__search-input"
                  />
                </div> */}
                
                {/* <div className="teacher-task-results__status-filter">
                  <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="teacher-task-results__select"
                  >
                    <option value="all">Все статусы</option>
                    <option value="in progress">На проверке</option>
                    <option value="completed">Принятые</option>
                    <option value="canceled">Отклоненные</option>
                  </select>
                </div> */}
              </div>
            </div>

            <div className="teacher-task-results__container">
              <div className="teacher-task-results__submissions-list">
                <h2 className="teacher-task-results__section-title">Решения студентов</h2>
                
                {getFilteredTasks().length === 0 ? (
                  <div className="teacher-task-results__empty-list">
                    Нет доступных решений с выбранными фильтрами
                  </div>
                ) : (
                  <ul className="student-submissions-list">
                    {getFilteredTasks().map(task => (
                      <li 
                        key={task.id} 
                        className={`student-submission-item ${selectedStudent?.id === task.id ? 'student-submission-item--active' : ''}`}
                        onClick={() => handleSelectStudent(task)}
                      >
                        <div className="student-submission-item__header">
                          <span className="student-submission-item__name">
                            {task.student_name} {task.student_surname}
                          </span>
                          <span className={`student-submission-item__status ${getStatusClass(task.status)}`}>
                            {getStatusText(task.status)}
                          </span>
                        </div>
                        
                        <div className="student-submission-item__meta">
                          <span className="student-submission-item__date">
                            {formatDate(task.created_at)}
                          </span>
                          {task.status === 'completed' && (
                            <span className="student-submission-item__score">
                              Оценка: {task.score}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div className="teacher-task-results__details">
                {selectedStudent ? (
                  <div className="submission-details">
                    <div className="submission-details__header">
                      <h2 className="submission-details__title">
                        Решение {studentName}
                      </h2>
                      <span className="submission-details__date">
                        Отправлено: {formatDate(selectedStudent.created_at)}
                      </span>
                    </div>
                    
                    <div className="submission-details__task-description">
                      <h3 className="submission-details__subtitle">Описание задания</h3>
                      <div className="submission-details__description-text">
                        {task?.description}
                      </div>
                    </div>
                    
                    <div className="submission-details__code">
                      <h3 className="submission-details__subtitle">Код студента</h3>
                      <div className="submission-details__code-editor">
                        <CodeMirror
                          value={selectedStudent.code}
                          height="280px"
                          theme={vscodeDark}
                          readOnly={true}
                          extensions={[
                            python(),
                            EditorView.editable.of(false),
                          ]}
                        />
                      </div>
                    </div>
                    
                    {selectedStudent.code_with_comments_by_llm && (
                      <div className="submission-details__ai-comments">
                        <h3 className="submission-details__subtitle">Автоматический анализ кода</h3>
                        <div className="submission-details__code-editor">
                          <CodeMirror
                            value={selectedStudent.code_with_comments_by_llm}
                            height="280px"
                            theme={vscodeDark}
                            readOnly={true}
                            extensions={[
                              python(),
                              EditorView.editable.of(false),
                            ]}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="submission-details__feedback-form">
                      <h3 className="submission-details__subtitle">Обратная связь</h3>
                      
                      <div className="feedback-form__row">
                        <label className="feedback-form__label">
                          Оценка:
                          <div 
                            // value={score}
                            // onChange={(e) => setScore(parseFloat(e.target.value))}
                            // disabled={selectedStudent.status === 'completed' || submitting}
                            className="feedback-form__score-input"
                          >{score}</div>
                        </label>
                      </div>
                      
                      <div className="feedback-form__row">
                        <label className="feedback-form__label">
                          Комментарий:
                          <div 
                            // value=
                            // onChange={(e) => setRecommendation(e.target.value)}
                            // disabled={selectedStudent.status === 'completed' || submitting}
                            className="feedback-form__comment-input"
                            // placeholder="Напишите комментарий к решению студента..."
                            // rows={5}
                          >{recommendation}</div>
                        </label>
                      </div>
                      
                      {/* {selectedStudent.status === 'in progress' && ( */}
                        {/* <div className="feedback-form__buttons">
                          <button 
                            className="feedback-form__reject-button"
                            onClick={handleRejectTask}
                            disabled={submitting}
                          >
                            Отклонить
                          </button>
                          <button 
                            className="feedback-form__submit-button"
                            onClick={handleSubmitFeedback}
                            disabled={submitting}
                          >
                            {submitting ? 'Сохранение...' : 'Сохранить оценку'}
                          </button>
                        </div> */}
                      {/* )} */}
                      
                      {selectedStudent.status !== 'in progress' && (
                        <div className="feedback-form__status-message">
                          {selectedStudent.status === 'completed' 
                            ? 'Это задание уже оценено.' 
                            : 'Это задание было отклонено.'}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="submission-details__placeholder">
                    <div className="submission-details__placeholder-icon">👈</div>
                    <p>Выберите работу студента из списка слева</p>
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

export default TeacherTaskResultsPage;