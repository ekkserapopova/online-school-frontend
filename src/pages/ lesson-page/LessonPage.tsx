// LessonPage.tsx
import React, { FC, use, useEffect, useState } from 'react';
import './LessonPage.css';
import Navibar from '../../components/navbar/Navibar';
import Lesson from '../../components/lesson/Lesson';

import axios from 'axios';
import { Lesson as LessonData } from '../../modules/lesson';

const LessonPage: FC = () => {
    const lessonData = {
        courseTitle: "React для начинающих",
        lessonTitle: "Основы компонентов и пропсов",
        videoUrl: "/videos/lesson-3.mp4",  // Путь к видео
        description: "В этом уроке мы рассмотрим основные концепции React-компонентов и пропсов. Вы узнаете, как создавать переиспользуемые компоненты и передавать данные между ними с помощью пропсов.",
        materials: [
          {
            title: "Презентация к уроку",
            url: "/materials/presentation-3.pdf"
          },
          {
            title: "Исходный код примеров",
            url: "/materials/lesson-3-code.zip"
          },
          {
            title: "Дополнительные материалы по React",
            url: "/materials/react-additional.pdf"
          }
        ],
        nextLessonTitle: "Состояние и жизненный цикл компонентов"
      };

      const id = Number(window.location.pathname.split('/').pop());
      const [lesson, setLesson] = useState<LessonData>({} as LessonData);
      const [courseName, setCourseName] = useState<string>('');

      const getLesson = async() => {
        try{
            const auth_token = localStorage.getItem('auth_token');
            const response = await axios.get(`http://localhost:8080/api/lessons/${id}`, {
            headers: {
              Authorization: `Bearer ${auth_token}`
            }
            });
          const lessonData = response.data.lesson;
          setLesson(lessonData);
        } catch{
          console.error("Ошибка при получении данных урока");
        }
      }

      const getCourse = async() => {
        try{
          const auth_token = localStorage.getItem('auth_token');

          const response = await axios.get(`http://localhost:8080/api/modules/${lesson.module_id}`, {
            headers: {
              Authorization: `Bearer ${auth_token}`
            }
            });
          const courseData = response.data.course
          setCourseName(courseData.name);
        } catch{
          console.error("Ошибка при получении данных курса");
        }
      } 

      useEffect(() => {
        getLesson();
      }
      , []);

      useEffect(() => {
        console.log(lesson.module_id);
        getCourse();
      }
      , [lesson.module_id]);
  return (
    <>
    <Navibar/>
    <Lesson 
        description={lesson.description ?? ''}
        title={lesson.name}
        materials={lesson.materials ?? []}
        videoUrl={''}    />
    </>
  );
};

export default LessonPage;