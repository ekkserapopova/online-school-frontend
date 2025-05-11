import React from 'react';
import { Module as ModuleType } from '../../../../modules/module';
import ModuleLessonsList from '../module-lessons-list/ModuleLessonsList';
import ModuleTasksList from '../module-task-list/ModuleTasksList';
import ModuleTestsList from '../module-test-list/ModuleTestsList';
import ModuleMaterialsList from '../module-materials-list/ModuleMaterialsList';
import AddItem from '../add-item/AddItem';
import api from '../../../../modules/login';
import { Lesson } from '../../../../modules/lesson';

interface ModuleProps {
  module: ModuleType;
  isOpen: boolean;
  onToggle: (id: number) => void;

  // Уроки
  addingLessonToModuleId: number | null;
  onAddLessonClick: (id: number) => void;
  onAddLesson: (moduleId: number, lessonData: { name: string }) => void;
  onCancelAddLesson: () => void;

  // Задания
  addingTaskToModuleId?: number | null;
  onAddTaskClick?: (id: number) => void;
  onAddTask?: (moduleId: number, taskData: { name: string; description: string }) => void;
  onCancelAddTask?: () => void;

  // Тесты
  addingTestToModuleId?: number | null;
  onAddTestClick?: (id: number) => void;
  onAddTest?: (moduleId: number, testData: { name: string }) => void;
  onCancelAddTest?: () => void;
}

const Module: React.FC<ModuleProps> = ({ 
  module, 
  isOpen, 
  onToggle, 
  addingLessonToModuleId,
  onAddLessonClick,
  onAddLesson,
  onCancelAddLesson,
  addingTaskToModuleId,
  onAddTaskClick,
  onAddTask,
  onCancelAddTask,
  addingTestToModuleId,
  onAddTestClick,
  onAddTest,
  onCancelAddTest
}) => {

  const [lessons, setLessons] = React.useState(module.lessons);
  const deleteLesson = async (lessonID: string) => {
    try{
      await api.delete(`/lessons/${lessonID}`);
      console.log('Урок успешно удален');
    } catch (error) {
      console.error('Ошибка при удалении урока:', error);
    }
  };

  const updatedLesson = async (lessonID: string, updatedData:  Partial<Lesson>) => {
    try {
      console.log('Обновленные данные урока:', updatedData);
      const response = await api.put(`/lessons/${lessonID}`, updatedData);
      console.log('Урок успешно обновлен:', response.data);
      console.log('Обновленные данные урока:', updatedData);
      setLessons(prevLessons =>
        (prevLessons ?? []).map(lesson =>
          String(lesson.id) === String(lessonID) ? { ...lesson, ...updatedData } : lesson
        )
      );
    } catch (error) {
      console.error('Ошибка при обновлении урока:', error);
    }
  };

  return (
    <div className="module">
      <div className="module__header" onClick={() => onToggle(module.id)}>
        <div className="module__header-content">
          <h3 className="module__title">{module.name}</h3>
        </div>
        <button className="module__toggle-button">
          {isOpen ? (
            <span className="module__toggle-icon module__toggle-icon--up">▲</span>
          ) : (
            <span className="module__toggle-icon module__toggle-icon--down">▼</span>
          )}
        </button>
      </div>
      
      {isOpen && (
        <div className="module__content">
          <p className="module__description">{module.description}</p>
          
          <ModuleLessonsList 
          lessons={lessons} 
          onDeleteLesson={deleteLesson} 
          onUpdateLesson={(lessonID, updatedData) => updatedLesson(lessonID, updatedData)} 
          />
          {addingLessonToModuleId === module.id ? (
            <AddItem 
              type='lesson'
              moduleID={module.id}
              onAddItem={onAddLesson}
              onCancel={onCancelAddLesson}
            />
          ) : (
            <div className="module__button-container">
              <button 
                type="button"
                className="module__add-lesson-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddLessonClick(module.id);
                }}
              >
                <span className="module__add-lesson-icon">+</span>
                <span className="module__add-lesson-text">Добавить урок</span>
              </button>
            </div>
          )}

          <ModuleTasksList tasks={module.tasks} />
          {addingTaskToModuleId === module.id ? (
            <AddItem 
              type='task'
              moduleID={module.id}
              onAddItem={onAddTask!}
              onCancel={onCancelAddTask!}
            />
          ) : (
            <div className="module__button-container">
              <button 
                type="button"
                className="module__add-lesson-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddTaskClick?.(module.id);
                }}
              >
                <span className="module__add-lesson-icon">+</span>
                <span className="module__add-lesson-text">Добавить задание</span>
              </button>
            </div>
          )}

          <ModuleTestsList tests={module.tests} />
          {addingTestToModuleId === module.id ? (
            <AddItem 
              type='test'
              moduleID={module.id}
              onAddItem={onAddTest!}
              onCancel={onCancelAddTest!}
            />
          ) : (
            <div className="module__button-container">
              <button 
                type="button"
                className="module__add-lesson-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddTestClick?.(module.id);
                }}
              >
                <span className="module__add-lesson-icon">+</span>
                <span className="module__add-lesson-text">Добавить тест</span>
              </button>
            </div>
          )}

          <ModuleMaterialsList materials={module.materials} />

          <div className="module__actions">
            <button className="module__action-button module__action-button--edit">
              Редактировать
            </button>
            <button className="module__action-button module__action-button--delete">
              Удалить
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Module;
