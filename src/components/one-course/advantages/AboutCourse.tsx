import React from 'react';
import './AboutCourse.css';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface AboutCourseProps {
  title?: string;
  subtitle?: string;
  features?: Feature[];
}

const AboutCourse: React.FC<AboutCourseProps> = ({
  title = "Почему стоит учиться у нас?",
  subtitle = "Онлайн-школа программирования с уникальным подходом к обучению",
  features = defaultFeatures,
}) => {
  return (
    <div className="about-course">
      <div className="about-course-header">
        <h2 className="about-course-title">{title}</h2>
        <p className="about-course-subtitle">{subtitle}</p>
      </div>
      
      <div className="about-course-features">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon" dangerouslySetInnerHTML={{ __html: feature.icon }} />
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// SVG иконки для использования в компоненте
const svgIcons = {
  practice: `<svg viewBox="0 0 24 24" width="40" height="40">
    <path fill="#392C35" d="M4 4h16v2H4V4zm0 14h16v2H4v-2zm0-7h10v2H4v-2zM21.3 8l1.4 1.4-4.6 4.6-2.1-2.1 1.4-1.4 0.7 0.7L21.3 8z"/>
  </svg>`,
  tech:`<svg viewBox="0 0 24 24" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
    <path fill="#392C35" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
  </svg>`,
  feedback: `<svg viewBox="0 0 24 24" width="40" height="40">
    <path fill="#392C35" d="M3 17h2v2H3v-2zm4-4h2v6H7v-6zm4-4h2v10h-2V9zm4-4h2v14h-2V5zm4 8h2v6h-2v-6z"/>
  </svg>`,
  community: `<svg viewBox="0 0 24 24" width="40" height="40">
    <path fill="#392C35" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>`,
   actual:  `<svg viewBox="0 0 24 24" width="40" height="40">
   <path fill="#392C35" d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/>
 </svg>`,
  modules: `<svg viewBox="0 0 24 24" width="40" height="40">
    <path fill="#392C35" d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm8-2h8v8h-8v-8zm2 2v4h4v-4h-4z"/>
  </svg>`
};

const defaultFeatures: Feature[] = [
  {
    icon: svgIcons.practice,
    title: "Инновационная автоматическая проверка кода",
    description: "Система оценивает не только правильность вывода, но и качество написанного кода: читаемость, структуру. Получайте мгновенную и глубокую обратную связь."
  },
  {
    icon: svgIcons.tech,
    title: "Практический подход",
    description: "Более 70% времени обучения посвящено решению реальных задач. Вы не просто изучаете теорию — вы сразу применяете знания в деле."
  },
  {
    icon: svgIcons.feedback,
    title: "Обратная связь от системы и постоянный прогресс",
    description: "Вы видите свои ошибки сразу и получаете рекомендации, как улучшить код. Это помогает расти быстрее и увереннее."
  },
  {
    icon: svgIcons.community,
    title: "Гибкий график и доступ из любой точки мира",
    description: "Учитесь в удобное время и темпе. Доступ к курсам 24/7 с любого устройства — вы контролируете своё обучение."
  },
  {
    icon: svgIcons.actual,
    title: "Актуальные технологии и инструменты",
    description: "В курсах используются современные языки, фреймворки и среды разработки. Вы сразу работаете с тем, что применяют в индустрии сегодня."
  },
  {
    icon: svgIcons.modules,
    title: "Модульная система обучения",
    description: "Курсы разбиты на короткие модули по 10–20 минут. Это помогает усваивать материал последовательно и удобно возвращаться к нужным темам."
  }
];


export default AboutCourse;