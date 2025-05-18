import React, { useState } from 'react';
import { Task } from '../../../../modules/task';
import EditForm from '../edit-form/EditForm';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ModuleTasksList.css';
import { FiTrash } from 'react-icons/fi';

interface ModuleTasksListProps {
  tasks: Task[] | undefined;
  onUpdateTask: (taskId: string, updatedTask: Partial<Task>, type: string) => void;
  onDeleteTask: (taskId: string) => void; // Add a prop for deleting tasks
}

const ModuleTasksList: React.FC<ModuleTasksListProps> = ({ tasks, onUpdateTask, onDeleteTask }) => {
  const [hiddenTasks, setHiddenTasks] = useState<{ [key: string]: boolean }>({});
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const toggleTaskVisibility = (taskId: string, isActive: boolean) => {
    setHiddenTasks(prevState => ({
      ...prevState,
      [taskId]: !isActive, 
    }));
  
    onUpdateTask(taskId, { is_active: isActive }, 'tasks');
    
    updateTaskVisibility(taskId, isActive);

  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
  };

  const updateTaskVisibility = async (taskId: string, isActive: boolean) => {
    try{
        const authToken = localStorage.getItem('auth_token');
        await axios.patch(
          `http://localhost:8080/api/tasks/${taskId}`,
          { is_active: isActive },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
    } catch(error) {
      console.error('Ошибка обновления видимости задания:', error);
    }
  }

  const handleEditSubmit = (updatedTask: Partial<Task>) => {
    if (editingTask) {
      onUpdateTask(String(editingTask.id), updatedTask, 'tasks');
      setEditingTask(null);
    }
  };

  const handleDeleteClick = (taskId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить это задание?')) {
      onDeleteTask(taskId);
    }
  };

  if (!tasks || tasks.length === 0) return null;

  return (
    <div className="module__section">
      <h4 className="module__section-title">Задания</h4>
      <ul className="module__list">
        {tasks.map(task => {
          const isHidden = !task.is_active; 
          return (
            <React.Fragment key={task.id}>
              <li
                className={`module__list-item module__list-item--task ${
                  isHidden ? 'module__list-item--hidden' : ''
                }`}
              >
                <div className="module__list-item-content">
                  <strong className="module__task-name">{task.name}</strong>
                  <div className="module__all-buttons">
                  <div className="module__buttons">
                    <button
                      className="module__edit-button"
                      onClick={() => handleEditClick(task)}
                    >
                      Редактировать
                    </button>
                    <button
                      className="module__toggle-button"
                      onClick={() => toggleTaskVisibility(String(task.id), !task.is_active)}
                    >
                      {!task.is_active ? 'Показать' : 'Скрыть'}
                    </button>
                    <button
                      className="module__delete-button"
                      onClick={() => handleDeleteClick(String(task.id))}
                    >
                      <FiTrash size={18} color='red'/>
                    </button>
                  </div>
                    <div className="module__task-link-container">
                      <Link 
                        to={`/all/tasks/${task.id}`} 
                        className="module__task-link"
                      >
                        Перейти к решениям студентов →
                      </Link>
                  </div>
                  </div>
                </div>
              </li>
              {editingTask?.id === task.id && (
                <li className="module__list-item module__list-item--edit-form">
                  <EditForm
                    type='task'
                    item={editingTask}
                    onCancel={() => setEditingTask(null)}
                    onSubmit={handleEditSubmit}
                  />
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
};

export default ModuleTasksList;