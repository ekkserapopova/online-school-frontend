import React from 'react';
import { Module as ModuleType } from '../../../../modules/module';
import Module from '../one-module/Module';
import ModuleForm from '../module-form/ModuleForm';
import './CourseModules.css';
import TestQuestionManager from '../test/question/AddQuestion';
import axios from 'axios';

interface CourseModulesProps {
  modules: ModuleType[];
  openModules: Record<number, boolean>;
  toggleModule: (id: number) => void;
  showAddModuleForm: boolean;
  setShowAddModuleForm: (show: boolean) => void;

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

  // Добавление модуля
  onAddModule: (moduleData: { name: string; description: string }) => void;
}

const CourseModules: React.FC<CourseModulesProps> = ({ 
  modules, 
  openModules, 
  toggleModule,
  showAddModuleForm,
  setShowAddModuleForm,
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
  onCancelAddTest,
  onAddModule
}) => {
  return (
    <section className="course-modules">
      <h2 className="course-modules__title">Модули курса</h2>
      
      <div className="course-modules__list">
        {modules && modules.map(module => (
          <>
          <Module 
            key={module.id}
            module={module}
            isOpen={!!openModules[module.id]}
            onToggle={toggleModule}
            // Уроки
            addingLessonToModuleId={addingLessonToModuleId}
            onAddLessonClick={onAddLessonClick}
            onAddLesson={onAddLesson}
            onCancelAddLesson={onCancelAddLesson}
            // Задания
            addingTaskToModuleId={addingTaskToModuleId}
            onAddTaskClick={onAddTaskClick}
            onAddTask={onAddTask}
            onCancelAddTask={onCancelAddTask}
            // Тесты
            addingTestToModuleId={addingTestToModuleId}
            onAddTestClick={onAddTestClick}
            onAddTest={onAddTest}
            onCancelAddTest={onCancelAddTest}
          />

</>
        ))}
      </div>

      {!showAddModuleForm && (
        <button 
          onClick={() => setShowAddModuleForm(true)}
          className="add-module-button"
        >
          + Добавить модуль
        </button>
      )}
      
      {showAddModuleForm && <ModuleForm onAddModule={onAddModule} />}
    </section>
  );
};

export default CourseModules;
