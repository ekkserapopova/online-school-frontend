import React, { useState } from 'react';
import ActionButton from '../action-button/ActionButton';
import './LessonSelector.css';
import { Lesson } from '../../../../../modules/lesson';

interface LessonSelectorProps {
  selectedLessons: Lesson[];
  availableLessons: Lesson[];
  onAddLesson: (lesson: Lesson) => void;
  onRemoveLesson: (lessonId: number) => void;
}

const LessonSelector: React.FC<LessonSelectorProps> = ({
  selectedLessons,
  availableLessons,
  onAddLesson,
  onRemoveLesson
}) => {
  const [isSelecting, setIsSelecting] = useState(false);
  
  const getLessonTypeIcon = (type: string = '') => {
    switch(type) {
      case 'video': return '🎬';
      case 'practice': return '💻';
      case 'quiz': return '❓';
      case 'project': return '🏗️';
      default: return '📄';
    }
  };
  
  return (
    <div className="lesson-selector">
      <div className="lesson-selector__header">
        <h4>Lessons</h4>
        <ActionButton 
          onClick={() => setIsSelecting(!isSelecting)} 
          label={isSelecting ? "Done" : "+ Add Lessons"} 
        />
      </div>
      
      {isSelecting && (
        <div className="available-lessons">
          <h5>Available Lessons</h5>
          {availableLessons.length === 0 ? (
            <p className="no-lessons">No more lessons available</p>
          ) : (
            <ul className="lessons-list">
              {availableLessons.map(lesson => (
                <li key={lesson.id} className="lesson-item">
                  <div className="lesson-info">
                    <span className="lesson-type-icon">{getLessonTypeIcon(lesson.type)}</span>
                    <div className="lesson-details">
                      <span className="lesson-name">{lesson.name}</span>
                      <span className="lesson-description">{lesson.description}</span>
                    </div>
                  </div>
                  <ActionButton 
                    onClick={() => onAddLesson(lesson)} 
                    label="Add" 
                    small 
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      
      <div className="selected-lessons">
        <h5>Module Lessons {selectedLessons.length > 0 && `(${selectedLessons.length})`}</h5>
        {selectedLessons.length === 0 ? (
          <p className="no-lessons">No lessons in this module yet</p>
        ) : (
          <ul className="lessons-list">
            {selectedLessons.map((lesson, index) => (
              <li key={lesson.id || index} className="lesson-item">
                <div className="lesson-order">{index + 1}</div>
                <div className="lesson-info">
                  <span className="lesson-type-icon">{getLessonTypeIcon(lesson.type)}</span>
                  <div className="lesson-details">
                    <span className="lesson-name">{lesson.name}</span>
                    <span className="lesson-description">{lesson.description}</span>
                  </div>
                </div>
                <div className="lesson-actions">
                  <ActionButton 
                    onClick={() => onRemoveLesson(lesson.id!)} 
                    label="Remove" 
                    secondary 
                    small 
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LessonSelector;