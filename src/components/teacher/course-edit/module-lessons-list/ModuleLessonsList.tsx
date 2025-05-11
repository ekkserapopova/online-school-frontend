import React, { useState } from 'react';
import { Lesson } from '../../../../modules/lesson';
import './ModuleLessonsList.css';
import EditForm from '../edit-form/EditForm';

interface ModuleLessonsListProps {
  lessons: Lesson[] | undefined;
  onUpdateLesson: (lessonId: string, updatedLesson: Partial<Lesson>) => void;
  onDeleteLesson: (lessonId: string) => void; // Add a prop for deleting lessons
}

const ModuleLessonsList: React.FC<ModuleLessonsListProps> = ({ lessons, onUpdateLesson, onDeleteLesson }) => {
  const [hiddenLessons, setHiddenLessons] = useState<{ [key: string]: boolean }>({});
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const toggleLessonVisibility = (lessonId: string) => {
    setHiddenLessons(prevState => ({
      ...prevState,
      [lessonId]: !prevState[lessonId],
    }));
  };

  const handleEditClick = (lesson: Lesson) => {
    setEditingLesson(lesson);
  };

  const handleEditSubmit = (updatedLesson: Partial<Lesson>) => {
    if (editingLesson) {
      onUpdateLesson(String(editingLesson.id), updatedLesson);
      setEditingLesson(null);
    }
  };

  const handleDeleteClick = (lessonId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот урок?')) {
      onDeleteLesson(lessonId);
    }
  };

  if (!lessons) return null;

  return (
    <div className="module__section">
      <h4 className="module__section-title">Уроки</h4>
      <ul className="module__list">
        {lessons.length > 0 ? (
          lessons.map(lesson => {
            const isHidden = hiddenLessons[String(lesson.id)] || !lesson.is_active; // Добавлена проверка на is_active
            return (
              <React.Fragment key={lesson.id}>
                <li
                  className={`module__list-item module__list-item--lesson ${
                    isHidden ? 'module__list-item--hidden' : ''
                  }`}
                >
                  <div className="module__list-item-content">
                    <span className="module__lesson-name">{lesson.name}</span>
                    <div className="module__buttons">
                      <button
                        className="module__edit-button"
                        onClick={() => handleEditClick(lesson)}
                      >
                        Редактировать
                      </button>
                      <button
                        className="module__toggle-button"
                        onClick={() => toggleLessonVisibility(String(lesson.id))}
                      >
                        {hiddenLessons[String(lesson.id)] ? 'Показать' : 'Скрыть'}
                      </button>
                      <button
                        className="module__delete-button"
                        onClick={() => handleDeleteClick(String(lesson.id))}
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </li>
                {editingLesson?.id === lesson.id && (
                  <li className="module__list-item module__list-item--edit-form">
                    <EditForm
                      type='lesson'
                      item={editingLesson}
                      onCancel={() => setEditingLesson(null)}
                      onSubmit={handleEditSubmit}
                    />
                  </li>
                )}
              </React.Fragment>
            );
          })
        ) : (
          <li className="module__list-item module__list-item--empty">
            <span>Нет доступных уроков</span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default ModuleLessonsList;