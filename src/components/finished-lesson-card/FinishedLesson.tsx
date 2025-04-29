import React from 'react';
import './FinishedLesson.css';
import {  LessonWithCourse } from '../../modules/lesson';

interface ArchiveLessonRowProps {
  lesson: LessonWithCourse;
}

const FinishedLessonCard: React.FC<ArchiveLessonRowProps> = ({ lesson }) => {
  // Форматирование даты в российском формате
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <tr className="archive-lesson-row">
      <td className="archive-lesson-row__name">{lesson.lesson.name}</td>
      <td className="archive-lesson-row__course">{lesson.course_name}</td>
      <td className="archive-lesson-row__date">{formatDate(lesson.lesson.start)}</td>
    </tr>
  );
};

export default FinishedLessonCard;