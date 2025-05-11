// LessonPage.tsx
import React, { useState } from 'react';
import './Lesson.css';

interface LessonProps {
  courseTitle: string;
  lessonTitle: string;
  videoUrl: string;
  description: string;
  materials: {
    title: string;
    url: string;
  }[];
  nextLessonTitle?: string;
}

const Lesson: React.FC<LessonProps> = ({
  courseTitle,
  lessonTitle,
  videoUrl,
  description,
  materials,
  nextLessonTitle
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [notes, setNotes] = useState('');
  const [showChat, setShowChat] = useState(false);
  
  const handleMarkAsCompleted = () => {
    setIsCompleted(!isCompleted);
  };

  return (
    <div className="lesson">
      <header className="lesson__header">
        
        <h1 className="lesson__title--large">{lessonTitle}</h1>
        <div className="lesson__navigation">
          <h3 className="lesson__course-title">{courseTitle}</h3>
          <div className="lesson__progress">
            <div className="lesson__progress-bar">
              <div className="lesson__progress-filled"></div>
            </div>
            {/* <span className="lesson__progress-text">3/12 уроков пройдено</span> */}
          </div>
        </div>
      </header>

      <div className="lesson__content">
        <main className="lesson__main">
          <div className="lesson__video-container">
            <video 
              controls
              poster="/video-placeholder.jpg"
              className="lesson__video"
            >
              <source src={videoUrl} type="video/mp4" />
              Ваш браузер не поддерживает видео.
            </video>
            
          </div>

          <div className="lesson__description">
            <h2 className="lesson__section-title">Описание урока</h2>
            <p className="lesson__text">{description}</p>
          </div>

          <div className="lesson__materials">
            <h2 className="lesson__section-title">Материалы урока</h2>
            <ul className="lesson__materials-list">
              {materials.map((material, index) => (
                <li key={index} className="lesson__material-item">
                  <a href={material.url} className="lesson__material-link">
                    {material.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </main>

        <aside className="lesson__sidebar">
          <div className="lesson__notes">
            <h3 className="lesson__sidebar-title">Заметки</h3>
            <textarea 
              className="lesson__notes-area" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Записывайте важные моменты урока..."
            />
          </div>

          <div className="lesson__actions">
            <button 
              className={`lesson__complete-button ${isCompleted ? 'lesson__complete-button--completed' : ''}`}
              onClick={handleMarkAsCompleted}
            >
              {isCompleted ? 'Урок пройден ✓' : 'Отметить как пройденный'}
            </button>
            
            {/* <button 
              className="lesson__chat-button"
              onClick={() => setShowChat(!showChat)}
            >
              Задать вопрос преподавателю
            </button> */}
          </div>

          {nextLessonTitle && (
            <div className="lesson__next">
              <h3 className="lesson__sidebar-title">Следующий урок</h3>
              <button className="lesson__next-button">
                {nextLessonTitle} →
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* {showChat && (
        <div className="lesson__chat">
          <div className="lesson__chat-header">
            <h3 className="lesson__chat-title">Чат с преподавателем</h3>
            <button 
              className="lesson__chat-close" 
              onClick={() => setShowChat(false)}
            >
              ×
            </button>
          </div>
          <div className="lesson__chat-messages">
            <div className="lesson__chat-message lesson__chat-message--system">
              Задайте вопрос преподавателю. Среднее время ответа - 15 минут.
            </div>
          </div>
          <div className="lesson__chat-input-container">
            <input 
              className="lesson__chat-input" 
              placeholder="Введите сообщение..."
            />
            <button className="lesson__chat-send">Отправить</button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Lesson;