import React, { useState } from 'react';
import LessonSelector from '../lesson-selector/LessonSelector';
import NameInput from '../name-input/NameInput';
import ActionButton from '../action-button/ActionButton';
import './ModuleSection.css';
import { Module } from '../../../../../modules/module';
import { Lesson } from '../../../../../modules/lesson';

interface ModuleSectionProps {
  module: Module;
  availableLessons: Lesson[];
  onUpdate: (updatedModule: Module) => void;
  onRemove: () => void;
}

const ModuleSection: React.FC<ModuleSectionProps> = ({ 
  module, 
  availableLessons, 
  onUpdate, 
  onRemove 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const updateModuleName = (name: string) => {
    onUpdate({
      ...module,
      name
    });
  };
  
  const updateModuleDescription = (description: string) => {
    onUpdate({
      ...module,
      description
    });
  };
  
  const addLesson = (lesson: Lesson) => {
    const updatedLessons = [...(module.lessons || []), {...lesson, module: module}];
    onUpdate({
      ...module,
      lessons: updatedLessons
    });
  };
  
  const removeLesson = (lessonId: number) => {
    onUpdate({
      ...module,
      lessons: module.lessons?.filter(lesson => lesson.id !== lessonId)
    });
  };
  
  return (
    <div className="module-section">
      <div 
        className="module-section__header" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="module-title">
          <span className="expand-icon">{isExpanded ? '▼' : '►'}</span>
          <h3>{module.name || `Module ${module.id}`}</h3>
        </div>
        <div className="module-actions">
          <ActionButton onClick={(e) => { e.stopPropagation(); onRemove(); }} label="Remove" secondary />
        </div>
      </div>
      
      {isExpanded && (
        <div className="module-section__content">
          <div className="module-details">
            <NameInput 
              label="Module Name" 
              value={module.name} 
              onChange={updateModuleName} 
              placeholder="Enter module name"
            />
            <NameInput 
              label="Module Description" 
              value={module.description} 
              onChange={updateModuleDescription} 
              placeholder="Enter module description"
              textarea
            />
          </div>
          
          <LessonSelector
            selectedLessons={module.lessons || []}
            availableLessons={availableLessons.filter(lesson => 
              !(module.lessons || []).some(selectedLesson => selectedLesson.id === lesson.id)
            )}
            onAddLesson={addLesson}
            onRemoveLesson={removeLesson}
          />
        </div>
      )}
    </div>
  );
};

export default ModuleSection;