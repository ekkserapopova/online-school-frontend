import React, { useState } from 'react';
import { Task } from '../../../../modules/task';
import EditForm from '../edit-form/EditForm';

interface ModuleTasksListProps {
  tasks: Task[] | undefined;
  onUpdateTask: (taskId: string, updatedTask: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void; // Add a prop for deleting tasks
}

const ModuleTasksList: React.FC<ModuleTasksListProps> = ({ tasks, onUpdateTask, onDeleteTask }) => {
  const [hiddenTasks, setHiddenTasks] = useState<{ [key: string]: boolean }>({});
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const toggleTaskVisibility = (taskId: string) => {
    setHiddenTasks(prevState => ({
      ...prevState,
      [taskId]: !prevState[taskId],
    }));
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
  };

  const handleEditSubmit = (updatedTask: Partial<Task>) => {
    if (editingTask) {
      onUpdateTask(String(editingTask.id), updatedTask);
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
          const isHidden = hiddenTasks[String(task.id)];
          return (
            <React.Fragment key={task.id}>
              <li
                className={`module__list-item module__list-item--task ${
                  isHidden ? 'module__list-item--hidden' : ''
                }`}
              >
                <div className="module__list-item-content">
                  <strong className="module__task-name">{task.name}</strong>
                  <div className="module__buttons">
                    <button
                      className="module__edit-button"
                      onClick={() => handleEditClick(task)}
                    >
                      Редактировать
                    </button>
                    <button
                      className="module__toggle-button"
                      onClick={() => toggleTaskVisibility(String(task.id))}
                    >
                      {isHidden ? 'Показать' : 'Скрыть'}
                    </button>
                    <button
                      className="module__delete-button"
                      onClick={() => handleDeleteClick(String(task.id))}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </li>
              {editingTask?.id === task.id && (
                <li className="module__list-item module__list-item--edit-form">
                  <EditForm
                    type='task'
                    // task={editingTask}
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