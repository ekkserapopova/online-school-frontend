import { useState, useEffect } from 'react';
import { X, Plus, Check } from 'lucide-react';
import './CreatingCourse.css';
import { Language } from '../../../modules/languages';
import axios from 'axios';
import Navibar from '../../../components/navbar/Navibar';


interface CourseCreate {
  name: string;
  description: string;
  difficulty: number;
  price: number;
  languages: Language[];
}

export default function CourseCreationPage() {
  const [courseData, setCourseData] = useState<CourseCreate>({
    name: '',
    description: '',
    difficulty: 1,
    price: 0,
    languages: []
  });
  
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);


  const getLanguages = async () => {
    try {
        const authToken = localStorage.getItem('auth_token');
        const response = await axios.get('http://localhost:8080/api/languages', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const languagesData = response.data.languages;
        setAvailableLanguages(languagesData || []);
        console.log("Доступные языки:", languagesData);
    } catch (error) {
        console.error("Ошибка при получении языков:", error);
    }
  };

  useEffect(() => {
    getLanguages();
  }, []);
  
  const [selectedLanguageIds, setSelectedLanguageIds] = useState<number[]>([]);
  const [customLanguageInput, setCustomLanguageInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Обработчики изменений
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseData(prev => ({ ...prev, [name]: value }));
  };

  const handleDifficultyChange = (difficulty: number) => {
    setCourseData(prev => ({ ...prev, difficulty }));
  };

  // Обновлять courseData.languages только валидными Language из availableLanguages
  const toggleLanguage = (languageId: number, languageName: string) => {
    setSelectedLanguageIds(prev => {
      let newSelected: number[];
      if (prev.includes(languageId)) {
        newSelected = prev.filter(id => id !== languageId);
      } else {
        newSelected = [...prev, languageId];
      }
      // Обновляем courseData.languages на основе выбранных id
      setCourseData(prevData => ({
        ...prevData,
        languages: availableLanguages.filter(lang => newSelected.includes(lang.id))
      }));
      return newSelected;
    });
  };

  // Добавление кастомного языка (без id и course_id, но типизировано как Language)
  const addCustomLanguage = () => {
    if (customLanguageInput.trim() === '') return;
    setCourseData(prev => ({
      ...prev,
      languages: [
        ...prev.languages,
        {
          id: Date.now(), // временный id для соответствия типу Language
          name: customLanguageInput,
          course_id: 0 // временное значение
        }
      ]
    }));
    setCustomLanguageInput('');
  };

  const removeCustomLanguage = (languageName: string) => {
    setCourseData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.name !== languageName)
    }));
  };

  const createCourse = async () => {
    try{
        const authToken = localStorage.getItem('auth_token');
        const response = await axios.post(
          'http://localhost:8080/api/courses',
          courseData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        console.log("Курс успешно создан:", response.data.course);
        setSuccessMessage('Курс успешно создан!');
        setCourseData({
          name: '',
          description: '',
          difficulty: 1,
          price: 0,
          languages: []
        });
        setSelectedLanguageIds([]);
        setCustomLanguageInput('');
        setIsSubmitting(false);     
    } catch (error) {
        console.error("Ошибка при создании курса:", error);
        setSuccessMessage('Ошибка при создании курса. Попробуйте еще раз.');
    }}


  // Рендеринг компонента
  return (
    <>
    <Navibar />
    <div className="page">
      <div className="course-form">
        <h1 className="course-form__title">Создание нового курса</h1>
        
        {successMessage && (
          <div className="course-form__success-message">
            <Check size={20} className="course-form__success-icon" />
            {successMessage}
          </div>
        )}
        
        <div>
          {/* Название курса */}
          <div className="form-group">
            <label className="form-group__label" htmlFor="name">
              Название курса
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={courseData.name}
              onChange={handleInputChange}
              className="form-group__input"
              placeholder="Введите название курса"
              required
            />
          </div>
          
          {/* Описание курса */}
          <div className="form-group">
            <label className="form-group__label" htmlFor="description">
              Описание
            </label>
            <textarea
              id="description"
              name="description"
              value={courseData.description}
              onChange={handleInputChange}
              className="form-group__textarea"
              placeholder="Опишите ваш курс"
              required
            />
          </div>

          
          
          {/* Сложность */}
          <div className="form-group">
            <label className="form-group__label">
              Сложность (от 1 до 5)
            </label>
            <div className="difficulty">
              {[1, 2, 3, 4, 5].map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleDifficultyChange(level)}
                  className={`difficulty__button ${
                    courseData.difficulty === level ? 'difficulty__button--active' : ''
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          
          {/* Выбор языков программирования */}
          <div className="form-group">
            <label className="form-group__label">
              Языки программирования
            </label>
            <div className="languages">
              <div className="languages__list">
                {availableLanguages.map(language => (
                  <button
                    key={language.id}
                    type="button"
                    onClick={() => toggleLanguage(language.id, language.name)}
                    className={`languages__item ${
                      selectedLanguageIds.includes(language.id) ? 'languages__item--active' : ''
                    }`}
                  >
                    {language.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Добавление своего языка */}
            <div className="custom-language">
              <label className="custom-language__label">
                Добавить свой язык
              </label>
              <div className="custom-language__container">
                <input
                  type="text"
                  value={customLanguageInput}
                  onChange={(e) => setCustomLanguageInput(e.target.value)}
                  className="custom-language__input"
                  placeholder="Название языка"
                />
                <button
                  type="button"
                  onClick={addCustomLanguage}
                  className="custom-language__button"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
            
            {/* Список выбранных и добавленных языков */}
            {courseData.languages.length > 0 && (
              <div className="added-languages">
                <h3 className="added-languages__title">Выбранные языки:</h3>
                <div className="added-languages__list">
                  {courseData.languages.map((lang, index) => (
                    <div key={index} className="added-languages__item">
                      <span className="added-languages__text">{lang.name}</span>
                      <button
                        type="button"
                        onClick={() => removeCustomLanguage(lang.name)}
                        className="added-languages__remove"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Кнопка создания */}
          <button
            onClick={createCourse}
            disabled={isSubmitting}
            className={`submit-button ${
              isSubmitting ? 'submit-button--loading' : ''
            }`}
          >
            {isSubmitting ? 'Создание...' : 'Создать курс'}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}