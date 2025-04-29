import React from 'react';
import './TaskAttemptsList.css';
import { StudentTask } from '../../modules/task';

interface TaskAttemptsListProps {
  attempts: StudentTask[] | Array<any>;
  taskId: number;
  onSelectAttempt: (code: string, attemptId: number) => void;
  activeAttemptId?: number;
  onSolveAgain: () => void; // Добавляем обработчик для кнопки "Решить еще раз"
}

const TaskAttemptsList: React.FC<TaskAttemptsListProps> = ({ 
  attempts, 
  onSelectAttempt,
  activeAttemptId,
  onSolveAgain
}) => {
  // Проверяем, что attempts - это массив
  const attemptsList = Array.isArray(attempts) ? attempts : [];

  // Функция для форматирования даты
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Функция для получения статуса попытки
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'in progress': return 'Проверяется';
      case 'canceled': return 'Отклонено';
      case 'completed': return 'Принято';
      default: return 'Неизвестно';
    }
  };

  // Функция для получения класса статуса попытки
  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'in progress': return 'status-pending';
      case 'canceled': return 'status-rejected';
      case 'completed': return 'status-approved';
      default: return '';
    }
  };

  return (
    <div className="task-attempts">
      <h2 className="task-attempts__title">История решений</h2>
      
      {/* Кнопка "Решить еще раз" в начале компонента */}
      <div className="task-attempts__new-solution">
        <button 
          className="task-attempts__solve-again-btn"
          onClick={onSolveAgain}
        >
          Решить еще раз
        </button>
      </div>
      
      {attemptsList.length === 0 ? (
        <div className="task-attempts__empty">
          У вас пока нет попыток решения этой задачи
        </div>
      ) : (
        <ul className="task-attempts__list">
          {attemptsList.map((attempt) => (
            <li 
              key={attempt.id} 
              className={`task-attempt ${activeAttemptId === attempt.id ? 'task-attempt--active' : ''}`}
              onClick={() => onSelectAttempt(attempt.code, attempt.id)}
            >
              <div className="task-attempt__header">
                <span className="task-attempt__date">
                  {formatDate(attempt.created_at)}
                </span>
                <span className={`task-attempt__status ${getStatusClass(attempt.status)}`}>
                  {getStatusText(attempt.status)}
                </span>
              </div>
              
              <div className="task-attempt__code-preview">
                {attempt.code?.split('\n').slice(0, 3).join('\n')}
                {(attempt.code?.split('\n').length || 0) > 3 && '...'}
              </div>
              
              {attempt.score !== undefined && (
                <div className="task-attempt__grade">
                  Оценка: <span>{attempt.score}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      
      <div className="task-attempts__info">
        <p>Выберите попытку, чтобы просмотреть решение</p>
      </div>
    </div>
  );
};

export default TaskAttemptsList;