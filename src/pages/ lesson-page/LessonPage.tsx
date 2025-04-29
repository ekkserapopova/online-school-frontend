// LessonPage.tsx
import React, { FC, useState } from 'react';
import './LessonPage.css';
import Navibar from '../../components/navbar/Navibar';
import Lesson from '../../components/lesson/Lesson';

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
  return (
    <>
    <Navibar/>
    <Lesson {...lessonData}/>
    </>
  );
};

export default LessonPage;