import React, { useState, useEffect } from 'react';

import ModuleSection from '../module-section/ModuleSection';
import NameInput from '../name-input/NameInput';
import ActionButton from '../action-button/ActionButton';
import './CourseBuilder.css';
import { OneCourse } from '../../../../../modules/courses';
import { Lesson } from '../../../../../modules/lesson';
import { Module } from '../../../../../modules/module';

const CourseBuilder: React.FC = () => {
  const [course, setCourse] = useState<OneCourse>({
    id: 0,
    name: '',
    description: '',
    difficulty: 1,
    price: 0,
    teacherID: 1, // Assuming current logged-in teacher ID
    teacher: {
        id: 1, name: 'Teacher Name',
        surname: 'Teacher SurName',
        email: 'email'
    }, // Mock data
    modules: []
  });
  
  const [availableLessons, setAvailableLessons] = useState<Lesson[]>([]);
  
  useEffect(() => {
    // Fetch available lessons from API
    // This would be replaced with actual API call
    const mockLessons: Lesson[] = [
      { id: 1, name: 'Introduction to React', description: 'Basic concepts of React', start: '2025-05-01', end: '2025-05-07', courseID: 0, module: { id: 0, name: '', description: '', progress: 0 }, type: 'video' },
      { id: 2, name: 'Components and Props', description: 'Understanding components', start: '2025-05-08', end: '2025-05-14', courseID: 0, module: { id: 0, name: '', description: '', progress: 0 }, type: 'practice' },
      { id: 3, name: 'State and Lifecycle', description: 'Managing state', start: '2025-05-15', end: '2025-05-21', courseID: 0, module: { id: 0, name: '', description: '', progress: 0 }, type: 'quiz' },
      { id: 4, name: 'Hooks', description: 'Using React Hooks', start: '2025-05-22', end: '2025-05-28', courseID: 0, module: { id: 0, name: '', description: '', progress: 0 }, type: 'video' },
      { id: 5, name: 'Final Project', description: 'Building a complete app', start: '2025-05-29', end: '2025-06-07', courseID: 0, module: { id: 0, name: '', description: '', progress: 0 }, type: 'project' }
    ];
    
    setAvailableLessons(mockLessons);
  }, []);
  
  const addModule = () => {
    const newModule: Module = {
      id: course.modules.length + 1,
      name: `Module ${course.modules.length + 1}`,
      description: '',
      lessons: [],
      progress: 0
    };
    
    setCourse({
      ...course,
      modules: [...course.modules, newModule]
    });
  };
  
  const updateModule = (updatedModule: Module) => {
    setCourse({
      ...course,
      modules: course.modules.map(module => 
        module.id === updatedModule.id ? updatedModule : module
      )
    });
  };
  
  const removeModule = (moduleId: number) => {
    setCourse({
      ...course,
      modules: course.modules.filter(module => module.id !== moduleId)
    });
  };
  
  const saveCourse = () => {
    console.log('Saving course:', course);
    // API call to save course
    alert('Course saved successfully!');
  };
  
  return (
    <div className="course-builder">
      <div className="course-builder__header">
        <h1>Course Builder</h1>
        <div className="save-button-container">
          <ActionButton onClick={saveCourse} label="Save Course" primary />
        </div>
      </div>
      
      <div className="course-builder__basics">
        <div className="input-group">
          <NameInput 
            label="Course Title" 
            value={course.name} 
            onChange={(value) => setCourse({...course, name: value})} 
            placeholder="Enter course title" 
          />
        </div>
        <div className="input-group">
          <NameInput 
            label="Course Description" 
            value={course.description} 
            onChange={(value) => setCourse({...course, description: value})} 
            placeholder="Enter course description" 
            textarea
          />
        </div>
        
        <div className="input-row">
          <div className="input-group">
            <label>Difficulty (1-5)</label>
            <input 
              type="number" 
              min="1" 
              max="5" 
              value={course.difficulty} 
              onChange={(e) => setCourse({...course, difficulty: parseInt(e.target.value)})} 
            />
          </div>
          <div className="input-group">
            <label>Price</label>
            <input 
              type="number" 
              min="0" 
              value={course.price} 
              onChange={(e) => setCourse({...course, price: parseInt(e.target.value)})} 
            />
          </div>
        </div>
      </div>
      
      <div className="course-builder__modules">
        <div className="modules-header">
          <h2>Modules</h2>
          <ActionButton onClick={addModule} label="+ Add Module" />
        </div>
        
        {course.modules.length === 0 && (
          <div className="empty-state">
            <p>No modules yet. Add a module to get started.</p>
          </div>
        )}
        
        {course.modules.map((module) => (
          <ModuleSection 
            key={module.id} 
            module={module} 
            availableLessons={availableLessons}
            onUpdate={updateModule}
            onRemove={() => removeModule(module.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseBuilder;