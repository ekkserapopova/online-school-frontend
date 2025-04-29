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
  title = "О чем этот курс",
  subtitle = "Изучите ключевые концепции и практические навыки, которые помогут вам стать профессионалом",
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
    <path fill="#392C35" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
  </svg>`,
  tech: `<svg viewBox="0 0 24 24" width="40" height="40">
    <path fill="#392C35" d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/>
  </svg>`,
  mentor: `<svg viewBox="0 0 24 24" width="40" height="40">
    <path fill="#392C35" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>`,
  community: `<svg viewBox="0 0 24 24" width="40" height="40">
    <path fill="#392C35" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>`,
  projects: `<svg viewBox="0 0 24 24" width="40" height="40">
    <path fill="#392C35" d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
  </svg>`,
  certificate: `<svg viewBox="0 0 24 24" width="40" height="40">
    <path fill="#392C35" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2V9h-2V7h4v10z"/>
  </svg>`
};

// Дефолтные фичи курса
const defaultFeatures: Feature[] = [
  {
    icon: svgIcons.practice,
    title: "Практический подход",
    description: "Более 70% времени курса посвящено практическим заданиям и работе над реальными проектами. Закрепите знания на практике."
  },
  {
    icon: svgIcons.tech,
    title: "Современные технологии",
    description: "Изучите актуальные инструменты и фреймворки, которые востребованы на рынке труда и используются в реальных проектах."
  },
  {
    icon: svgIcons.mentor,
    title: "Персональный ментор",
    description: "Опытный наставник поможет разобраться со сложными темами, даст обратную связь по выполненным заданиям и ответит на все вопросы."
  },
  {
    icon: svgIcons.community,
    title: "Сообщество единомышленников",
    description: "Присоединитесь к сообществу студентов, обменивайтесь опытом, находите единомышленников и потенциальных коллег."
  },
  {
    icon: svgIcons.projects,
    title: "Портфолио проектов",
    description: "Создайте 5 полноценных проектов для вашего портфолио, которые помогут продемонстрировать ваши навыки работодателям."
  },
  {
    icon: svgIcons.certificate,
    title: "Сертификат о прохождении",
    description: "По окончании курса вы получите сертификат, подтверждающий ваши знания и навыки, который можно добавить в резюме и LinkedIn."
  }
];

export default AboutCourse;