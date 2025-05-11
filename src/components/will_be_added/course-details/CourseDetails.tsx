import React, { useState } from 'react';
import { Course } from '../student-dashboard/StudentDashboard';
import ProgressBar from '../progress-bar/ProgressBar';
import './CourseDetails.css';
import { Task } from '../../../modules/task';

interface CourseDetailsProps {
  course: Course;
  onBack: () => void;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ course, onBack }) => {
  const [filter, setFilter] = useState<'all' | 'tests' | 'assignments'>('all');
  
  // Фильтрация заданий по типу
  const filteredTasks = course.tasks && course.tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'tests') return task.student_tasks[0].status === 'copleted';
    if (filter === 'assignments') return task.student_tasks[0].status === 'canceled';
    return true;
  });

  // Группировка заданий по статусу
  const completedTasks =  course.tasks && filteredTasks.filter(task => task.student_tasks[0].status = 'completed');
  const incompleteTasks = course.tasks && filteredTasks.filter(task => task.student_tasks[0].status != 'completed');

  return (
    <div className="course-details-container">
      <div className="course-details-header">
        <button className="back-button" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Назад к курсам
        </button>
        <h2>{course.name}</h2>
        <div className="course-progress-info">
          <div className="progress-stats">
            <div className="progress-percentage">
              <span className="progress-value">{course.progress}%</span>
              <span className="progress-label">выполнено</span>
            </div>
            <div className="tasks-stats">
              <span className="tasks-count">
                {(course.modules.map(module => 
                  (module.tasks && module.tasks.filter(task => task.student_tasks[0] && task.student_tasks[0].status == 'completed').length)
                ))} из {0} заданий
                {/* {course. tasks && course.tasks.filter(task => task.student_tasks[0].status == 'completed').length} из {course.tasks ? course.tasks.length: 0} заданий */}
              </span>
            </div>
          </div>
          <div className="course-progress-bar">
            <ProgressBar 
              progress={course.progress} 
              status={getProgressStatus(course.progress)} 
            />
          </div>
        </div>
      </div>

      <div className="tasks-container">
        <div className="tasks-filter">
          <button 
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Все задания
          </button>
          <button 
            className={`filter-button ${filter === 'tests' ? 'active' : ''}`}
            onClick={() => setFilter('tests')}
          >
            Тесты
          </button>
          <button 
            className={`filter-button ${filter === 'assignments' ? 'active' : ''}`}
            onClick={() => setFilter('assignments')}
          >
            Практические задания
          </button>
        </div>

        <div className="tasks-sections">
          {incompleteTasks && incompleteTasks.length > 0 && (
            <div className="tasks-section">
              <h3>Нужно выполнить</h3>
              <div className="tasks-list">
                {incompleteTasks && incompleteTasks.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {completedTasks && completedTasks.length > 0 && (
            <div className="tasks-section">
              <h3>Выполненные задания</h3>
              <div className="tasks-list completed">
                {completedTasks && completedTasks.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {filteredTasks && filteredTasks.length === 0 && (
            <div className="no-tasks">
              <p>Заданий не найдено.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Компонент для отображения отдельного задания
const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
  return (
    <div className={`task-item ${task.student_tasks[0].status == 'completed' ? 'completed' : ''}`}>
      <div className="task-info">
        <div className="task-title">
          {task.student_tasks[0].status == 'completed' ? <span className="task-check">✓</span> : null}
          {task.name}
        </div>
        <div className="task-meta">
          <span className={`task-type test`}>
            {/* {task.type === 'test' ? 'Тест' : 'Задание'} */}
            {'Задание'}
          </span>
          {task.deadline && (task.student_tasks[0].status != 'completed') && (
            <span className="task-due-date">Срок: {task.deadline}</span>
          )}
        </div>
      </div>
      <button className="task-action-button">
        {task.student_tasks[0].status == 'completed' ? 'Повторить' : 'Начать'}
      </button>
    </div>
  );
};

// Функция для определения статуса прогресса
const getProgressStatus = (progress: number): 'low' | 'medium' | 'high' | 'complete' => {
  if (progress < 30) return 'low';
  if (progress < 60) return 'medium';
  if (progress < 100) return 'high';
  return 'complete';
};

export default CourseDetails;