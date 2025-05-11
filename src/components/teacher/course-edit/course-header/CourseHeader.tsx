import React from 'react';
import './CourseHeader.css'

import { OneCourse } from '../../../../modules/courses';

interface CourseHeaderProps {
  course: OneCourse;
  onImageClick: () => void;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ course, onImageClick }) => {
  // Отображение уровня сложности
  const renderDifficultyStars = (difficulty: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`course-header__difficulty-star ${i <= difficulty ? 'course-header__difficulty-star--filled' : ''}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <section className="course-header">
      <div className="course-header__image-container">
        <div 
          className="course-header__image" 
          style={{ backgroundImage: course.image ? `url(${course.image})` : 'none' }}
          >
          <button 
            className="course-header__image-button"
            onClick={onImageClick}
          >
            {course.image === "/api/placeholder/800/400" ? "Добавить фото курса" : "Изменить фото курса"}
          </button>
        </div>
      </div>

      <div className="course-header__content">
        <h1 className="course-header__title">{course.name}</h1>
        <p className="course-header__description">{course.description}</p>
        
        <div className="course-header__meta">
          <div className="course-header__teacher">
            <span className="course-header__teacher-name">
              {/* Преподаватель: {course.teacher.name} */}
            </span>
          </div>
          
          <div className="course-header__info-block">
            <div className="course-header__difficulty">
              <span className="course-header__label">Сложность:</span>
              <div className="course-header__stars">
                {renderDifficultyStars(course.difficulty)}
              </div>
            </div>
            
            <div className="course-header__price">
              <span className="course-header__label">Стоимость:</span>
              <span className="course-header__price-value">
                {course.price ? course.price.toLocaleString(): 0} ₽
              </span>
            </div>
          </div>
          
          <div className="course-header__languages">
            <span className="course-header__label">Языки:</span>
            <div className="course-header__language-tags">
              {course.languages && course.languages.map(lang => (
                <span key={lang.id} className="course-header__language-tag">
                  {lang.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseHeader;