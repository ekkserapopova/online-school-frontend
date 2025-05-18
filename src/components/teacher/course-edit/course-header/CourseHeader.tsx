import React, { useEffect } from 'react';
import './CourseHeader.css'

import { OneCourse } from '../../../../modules/courses';
import axios from 'axios';

interface CourseHeaderProps {
  course: OneCourse;
  onImageClick: () => void;
  courseImage?: string | null;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ 
  course, 
  onImageClick,
  courseImage 
}) => {
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

  // Определяем источник изображения
  const imageSource = courseImage || course.image;
  const hasImage = imageSource && imageSource !== "/api/placeholder/800/400";
  const [photoURL, setPhotoURL] = React.useState<string | null>(null);

  const getPhoto = async () => {
    try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get(
          `http://localhost:8080/api/courses/${course.id}/image`,
          { 
            responseType: "blob",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const url = URL.createObjectURL(response.data);
        setPhotoURL(url);
    } catch (error) {
        console.error('Ошибка получения фото пользователя:', error);
        return null;
    }
}

useEffect(() => {
  if (course.id) {
    getPhoto();
  }
}, [course.id, courseImage]);

  return (
    <section className="course-header">
      <div className="course-header__image-container">
        <div 
          className={`course-header__image ${!hasImage ? 'course-header__image--empty' : ''}`}
            style={{ backgroundImage: photoURL ? `url(${photoURL})` : 'none' }}
        >
          <button 
            className="course-header__image-button"
            onClick={onImageClick}
          >
            {!hasImage ? "Добавить фото курса" : "Изменить фото курса"}
          </button>
        </div>
      </div>

      <div className="course-header__content">
        <h1 className="course-header__title">{course.name || 'Новый курс'}</h1>
        <p className="course-header__description">{course.description || 'Добавьте описание курса'}</p>
        
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
                {renderDifficultyStars(course.difficulty || 1)}
              </div>
            </div>
            
            <div className="course-header__price">
              <span className="course-header__label">Стоимость:</span>
              <span className="course-header__price-value">
                0 у.е.
              </span>
            </div>
          </div>
          
          <div className="course-header__languages">
            <span className="course-header__label">Языки:</span>
            <div className="course-header__language-tags">
              {course.languages && course.languages.length > 0 ? course.languages.map(lang => (
                <span key={lang.id} className="course-header__language-tag">
                  {lang.name}
                </span>
              )) : (
                <span className="course-header__language-tag course-header__language-tag--empty">
                  Не указаны
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseHeader;