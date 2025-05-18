import React, { useState } from 'react';
import { Module as ModuleType } from '../../../../modules/module';
import ModuleLessonsList from '../module-lessons-list/ModuleLessonsList';
import ModuleTasksList from '../module-task-list/ModuleTasksList';
import ModuleTestsList from '../module-test-list/ModuleTestsList';
import ModuleMaterialsList from '../module-materials-list/ModuleMaterialsList';
import AddItem from '../add-item/AddItem';
import api from '../../../../modules/login';
import { Lesson } from '../../../../modules/lesson';
import { Test } from '../../../../modules/test';
import { Task } from '../../../../modules/task';
import QuestionManager from '../test/question/AddQuestion';
import axios from 'axios';
import './Module.css';
import { toast } from 'react-toastify';
import ModuleEditForm from '../module-edit-form/ModuleEditForm';

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
  const [tasks, setTasks] = React.useState(module.tasks);
  const [tests, setTests] = React.useState(module.tests);


// Добавьте эту функцию в компонент Module
const generateQuestions = async (testId: string) => {
  try {
    // Найдем тест в массиве tests
    const test = tests?.find(t => String(t.id) === testId);
    if (!test) return;
    
    const token = localStorage.getItem('auth_token');
    
    // Показываем уведомление о начале генерации
    toast.info('Начата генерация вопросов...');
    
    const response = await axios.post(
      `http://localhost:8080/api/tests/${testId}/generate-questions`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    console.log('Вопросы успешно сгенерированы:', response.data);
    toast.success('Вопросы успешно сгенерированы!');
    
    // Обновляем информацию о тесте в локальном состоянии
    setTests(prevTests =>
      (prevTests ?? []).map(t =>
        String(t.id) === testId ? { ...t, has_questions: true } : t
      )
    );
    
  } catch (error) {
    console.error('Ошибка при генерации вопросов:', error);
    toast.error('Не удалось сгенерировать вопросы. Попробуйте позже.');
  }
};
  React.useEffect(() => {
    // Проверяем, относится ли сохранённый moduleId к текущему модулю
    const activeModuleId = sessionStorage.getItem('activeModuleId');
    const currentModuleId = `module-${module.id}`;
    
    if (activeModuleId === currentModuleId) {
      // Если это тот модуль, который был активен до перезагрузки,
      // программно открываем его
      onToggle(module.id);
      
      // Модуль найден, добавляем небольшую задержку для корректной прокрутки
      setTimeout(() => {
        const savedPosition = sessionStorage.getItem('scrollPosition');
        if (savedPosition) {
          window.scrollTo({
            top: parseInt(savedPosition),
            behavior: 'auto'
          });
          
          // Подсветим модуль на короткое время для индикации
          const moduleElement = document.getElementById(currentModuleId);
          if (moduleElement) {
            moduleElement.classList.add('module--highlight');
            setTimeout(() => {
              moduleElement.classList.remove('module--highlight');
            }, 1000);
          }
          
          // Очищаем данные из sessionStorage
          sessionStorage.removeItem('scrollPosition');
          sessionStorage.removeItem('activeModuleId');
        }
      }, 100);
    }
  }, [module.id, onToggle]);

  const deleteLesson = async (lessonID: string) => {
    try {
      await axios.delete(`http://localhost:8080/api/lessons/${lessonID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      setLessons(prevLessons =>
        (prevLessons ?? []).filter(lesson => String(lesson.id) !== String(lessonID))
      );
      console.log('Урок успешно удален');
      window.location.reload();
    } catch (error) {
      console.error('Ошибка при удалении урока:', error);
    }
  };

  const updatedLesson = async (lessonID: string, updatedData: Partial<Lesson>) => {
    try {
      console.log('Обновленные данные урока:', updatedData);
      const response = await axios.patch(
        `http://localhost:8080/api/lessons/${lessonID}`,
        updatedData,
        {
          headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      );
      console.log('Урок успешно обновлен:', response.data);
      setLessons(prevLessons =>
        (prevLessons ?? []).map(lesson =>
          String(lesson.id) === String(lessonID) ? { ...lesson, ...updatedData } : lesson
        )
      );
      window.location.reload();
    } catch (error) {
      console.error('Ошибка при обновлении теста:', error);
    }
  };

  const handleAddLesson = (moduleId: number, newLesson: Lesson) => {
    // Сохраняем текущую позицию скролла
    const scrollPosition = window.scrollY;
    // Сохраняем id модуля для фокуса
    const moduleElementId = `module-${moduleId}`;
    
    // Сохраняем данные в sessionStorage
    sessionStorage.setItem('scrollPosition', scrollPosition.toString());
    sessionStorage.setItem('activeModuleId', moduleElementId);
    sessionStorage.setItem('shouldOpenModule', 'true');
    
    // Обновляем локальное состояние
    setLessons(prevLessons => [...(prevLessons || []), newLesson]);
    onAddLesson(moduleId, { name: newLesson.name });
    
    // Перезагружаем страницу
    window.location.reload();
  };

  const handleAddTest = (moduleId: number, newTest: Test) => {
    setTests(prevTest=> [...(prevTest || []), newTest]);
    onAddTest?.(moduleId, { name: newTest.name });
  };

  const handleAddTask = (moduleId: number, newTask: Task) => {
    setTasks(prevTask=> [...(prevTask || []), newTask]);
    onAddTask?.(moduleId, {
      name: newTask.name,
      description: newTask.description
    });
  };

  const deleteTest = async (testID: string) => {
    try{
      await axios.delete(`http://localhost:8080/api/tests/${testID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      setTests(prevTests =>
        (prevTests ?? []).filter(test => String(test.id) !== String(testID))
      );
      console.log('Тест успешно удален');
      window.location.reload();
    } catch (error) {
      console.error('Ошибка при удалении теста:', error);
    }
  };

  const updatedTest = async (testID: string, updatedData:  Partial<Test>) => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/tests/${testID}`,
        updatedData,
        {
          headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      );
      console.log('Тест успешно обновлен:', response.data);
      setTests(prevTests =>
        (prevTests ?? []).map(test =>
          String(test.id) === String(testID) ? { ...test, ...updatedData } : test
        )
      );
      window.location.reload();
    } catch (error) {
      console.error('Ошибка при обновлении урока:', error);
    }
  };

  const deleteTask = async (taskID: string) => {
    try{
      await axios.delete(`http://localhost:8080/api/tasks/${taskID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      setTasks(prevTasks =>
        (prevTasks ?? []).filter(task => String(task.id) !== String(taskID))
      );
      console.log('Задание успешно удален');
      window.location.reload();
    } catch (error) {
      console.error('Ошибка при удалении задания:', error);
    }
  };

  const updatedTask = async (taskID: string, updatedData:  Partial<Task>) => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/tasks/${taskID}`,
        updatedData,
        {
          headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      );
      console.log('Задание успешно обновлен:', response.data);
      setTasks(prevTasks =>
        (prevTasks ?? []).map(task =>
          String(task.id) === String(taskID) ? { ...task, ...updatedData } : task
        )
      );
      window.location.reload();
    } catch (error) {
      console.error('Ошибка при обновлении задания:', error);
    }
  };


  const deleteModule = async () => {
    try {
      if (window.confirm('Вы уверены, что хотите удалить этот урок?')) {
        
      await axios.delete(`http://localhost:8080/api/modules/${module.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      console.log('Модуль успешно удален');
      window.location.reload();
    }
    } catch (error) {
      console.error('Ошибка при удалении модуля:', error);
    }
  };

  const [isEditing, setIsEditing] = useState(false);

  const updateModule = async (moduleId: number, updatedData: { name: string; description: string }) => {
    // Проверяем входящие данные
    console.log('updateModule получил данные:', { moduleId, updatedData });
    
    // Проверка, что данные не пустые
    if (!updatedData?.name) {
      console.error('Ошибка: Имя модуля не может быть пустым');
      toast.error('Ошибка: Имя модуля не может быть пустым');
      return;
    }
    
    try {
      const token = localStorage.getItem('auth_token');
      
      // Явно создаем объект с данными для отправки
      const dataToSend = {
        name: updatedData.name,
        description: updatedData.description || ''
      };
      
      console.log('Отправляем на сервер:', dataToSend);
      
      const response = await axios.patch(
        `http://localhost:8080/api/modules/${moduleId}`,
        dataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Ответ сервера:', response.data);
      
      // Завершаем режим редактирования
      setIsEditing(false);
      
      // Сохраняем позицию скролла для перезагрузки
      const scrollPosition = window.scrollY;
      const moduleElementId = `module-${moduleId}`;
      
      sessionStorage.setItem('scrollPosition', scrollPosition.toString());
      sessionStorage.setItem('activeModuleId', moduleElementId);
      
      // Показываем успешное уведомление
      toast.success('Модуль успешно обновлен');
      
      // Перезагружаем страницу для обновления данных с сервера
      window.location.reload();
      
    } catch (error) {
      console.error('Ошибка при обновлении модуля:', error);
      toast.error('Ошибка при обновлении модуля');
    }
  };

  return (
    <div className="module" id={`module-${module.id}`}>
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
              onAddItem={handleAddLesson}
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

          <ModuleTasksList tasks={tasks} 
          onDeleteTask={deleteTask}
          onUpdateTask={(taskID, updatedData) => updatedTask(taskID, updatedData)}/>
          {addingTaskToModuleId === module.id ? (
            <AddItem 
              type='task'
              moduleID={module.id}
              onAddItem={handleAddTask!}
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

          <ModuleTestsList tests={tests} 
          onDeleteTest={deleteTest}
          onUpdateTest={(testID, updatedData) => updatedTest(testID, updatedData)}/>
          {addingTestToModuleId === module.id ? (
            <AddItem 
              type='test'
              moduleID={module.id}
              onAddItem={handleAddTest!}
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

          {/* <ModuleMaterialsList materials={module.materials} /> */}
          {/* Questions section */}
            <div className="module-questions">
              <QuestionManager 
                moduleId={module.id} 
                isTeacher={true} // Adjust based on user role
              />
            </div>

          <div className="module__actions">
            <button className="module__action-button module__action-button--edit"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}>
              Редактировать
            </button>
            <button className="module__action-button module__action-button--delete" onClick={deleteModule}>
              Удалить
            </button>
          </div>
          {isEditing && (
  <ModuleEditForm
    moduleId={module.id}
    initialName={module.name}
    initialDescription={module.description || ''}
    onSubmit={updateModule}
    onCancel={() => setIsEditing(false)}
  />
)}
        </div>
      )}

      {/* <div> Сгенерирова ть тест</div> */}
    </div>
  );
};

export default Module;
