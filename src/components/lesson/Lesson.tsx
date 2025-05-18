import React, { useState } from 'react';
import './Lesson.css';
import { Material } from '../../modules/material';

interface LessonProps {
  title: string;
  videoUrl: string;
  description: string;
  materials: Material[];
  isCompleted?: boolean;
}

const Lesson: React.FC<LessonProps> = ({
  title,
  videoUrl,
  description,
  materials,
}) => {
  const [activeTab, setActiveTab] = useState('materials');
  
  // Функция для скачивания материала по его ID
  const downloadMaterial = async (materialId: number, materialTitle: string) => {
    try {
      const auth_token = localStorage.getItem('auth_token');
      
      // Уведомление о начале загрузки
      console.log(`Начинаем загрузку материала: ${materialTitle}`);
      
      // Запрос на сервер для получения файла
      const response = await fetch(`http://localhost:8080/api/materials/${materialId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${auth_token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      
      // Получаем blob из ответа
      const blob = await response.blob();
      
      // Создаем временную ссылку для скачивания
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      // Получаем расширение файла из Content-Type
      const contentType = response.headers.get('Content-Type') || '';
      let fileExtension = '.pdf'; // По умолчанию
      
      if (contentType.includes('pdf')) {
        fileExtension = '.pdf';
      } else if (contentType.includes('zip')) {
        fileExtension = '.zip';
      } else if (contentType.includes('msword') || contentType.includes('officedocument.wordprocessingml')) {
        fileExtension = '.docx';
      }
      
      // Задаем имя файла
      a.download = `${materialTitle}${fileExtension}`;
      
      // Добавляем ссылку в DOM, кликаем по ней и удаляем
      document.body.appendChild(a);
      a.click();
      
      // Таймаут для корректного скачивания
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      console.log(`Файл "${materialTitle}${fileExtension}" успешно загружен`);
    } catch (error) {
      console.error('Ошибка при скачивании файла:', error);
      alert(`Не удалось скачать файл: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  };

  return (
    <div className="lesson">
      <header className="lesson__header">
        <h1 className="lesson__name">{title}</h1>
      </header>

      <div className="lesson__content">
        <div className="lesson__video-container">
          <iframe
            width="100%"
            height="500"
            src={videoUrl || "https://rutube.ru/play/embed/3027afcea542e2a86b2c92ddc23bba09"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title}
          ></iframe>
        </div>

        <aside className="lesson__sidebar">
          <div className="lesson__description">
            <h2 className="lesson__section-title">Описание урока</h2>
            <p className="lesson__description-text">{description}</p>
          </div>

          <div className="lesson__tabs">
            <button 
              className={`lesson__tab ${activeTab === 'materials' ? 'lesson__tab--active' : ''}`}
            >
              Материалы
            </button>
          </div>

          <div className="lesson__tab-content">
            {activeTab === 'materials' && (
              <div className="lesson__materials">
                {materials && materials.length > 0 ? (
                  <ul className="lesson__materials-list">
                    {materials.map((material) => (
                      <li key={material.id} className="lesson__material-item">
                        <a 
                          href="#" 
                          className="lesson__material-link"
                          onClick={(e) => {
                            e.preventDefault();
                            downloadMaterial(material.id, material.name);
                          }}
                        >
                          {material?.name}
                        </a>
                        {/* <span className="lesson__material-type">{material.type}</span> */}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="lesson__no-content">Нет доступных материалов для этого урока</p>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Lesson;