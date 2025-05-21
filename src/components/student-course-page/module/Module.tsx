import { FC, useState } from "react";
import { Module } from "../../../modules/module";
import "./Module.css";
import { Link } from "react-router-dom";

// Функция для выбора правильной формы слова в зависимости от числа
function getNoun(number: number, one: string, two: string, five: string) {
  let n = Math.abs(number) % 100;
  let n1 = n % 10;
  if (n > 10 && n < 20) return five;
  if (n1 > 1 && n1 < 5) return two;
  if (n1 === 1) return one;
  return five;
}

interface ModuleProps {
  module: Module;
  index?: number;
}

const ModuleComponent: FC<ModuleProps> = ({ module, index = 0 }) => {
  const [open, setOpen] = useState(false);

  const toggleModule = () => {
    setOpen((prev) => !prev);
  };

  const getLessonIcon = (completed: boolean) => {
    if (completed) {
      return (
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      );
    } else {
      return (
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M8 5v14l11-7z"/>
        </svg>
      );
    }
  };

  const getTestIcon = (completed: boolean) => {
    if (completed) {
      return (
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      );
    } else {
      return (
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 14H8c-.55 0-1-.45-1-1s.45-1 1-1h8c.55 0 1 .45 1 1s-.45 1-1 1zm0-4H8c-.55 0-1-.45-1-1s.45-1 1-1h8c.55 0 1 .45 1 1s-.45 1-1 1zm0-4H8c-.55 0-1-.45-1-1s.45-1 1-1h8c.55 0 1 .45 1 1s-.45 1-1 1z"/>
        </svg>
      );
    }
  };

  // Получить общее количество элементов (уроки + тесты)
  const getItemsCount = () => {
    let count = 0;
    if (module.lessons) count += module.lessons.length;
    if (module.tests) count += module.tests.length;
    return count;
  };

const formatDateTime = (dateString: string) => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  
  const adjustedDate = new Date(date.getTime() - 3 * 60 * 60 * 1000);
  
  return adjustedDate.toLocaleString("ru-RU");
};

const formatTime = (dateString: string) => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  
  const adjustedDate = new Date(date.getTime() - 3 * 60 * 60 * 1000);
  
  return adjustedDate.toLocaleTimeString("ru-RU");
};

  return (
    <div className={`module ${open ? 'active' : ''}`}>
      <div className="module__header" onClick={toggleModule}>
        {index !== undefined && <div className="module__number">{index + 1}</div>}
        <div className="module__info">
          <h3 className="module__title">{module.name}</h3>
          <p className="module__meta">
            {getItemsCount() > 0 ? 
              [
              module.lessons?.length ? `${module.lessons.length} ${getNoun(module.lessons.length, 'видео-урок', 'видео-урока', 'видео-уроков')}` : null,
              module.tests?.length ? `${module.tests.length} ${getNoun(module.tests.length, 'тест', 'теста', 'тестов')}` : null,
              module.tasks?.length ? `${module.tasks.length} ${getNoun(module.tasks.length, 'задание на код', 'задания на код', 'заданий на код')}` : null,
              ].filter(Boolean).join(', ') : ''}

            {/* {module.progress !== undefined && ` | Прогресс: ${module.progress}%`} */}
          </p>
        </div>
        {/* <div className="module__toggle">
          <span></span>
          <span></span>
        </div> */}
      </div>
      <div className="module__content">
        <p className="module__description">{module.description}</p>
        
        {/* Объединенный список уроков и тестов */}
        <ul className="module__lessons">
          {/* Отображение уроков */}
          {module.lessons && module.lessons.map((lesson) => (
            <Link to= {`/lesson/${lesson.id}`} className="module__lesson-link">
            <li key={`lesson-${lesson.id}`} className="module__lesson">
              <div className="lesson__icon">
                {getLessonIcon(lesson.completed || false)}
              </div>
              <div className="lesson__info">
                <p className="lesson__title">{lesson.name}</p>
                <span className={`lesson__type ${lesson.completed ? 'lesson__type_practice' : 'lesson__type_video'}`}>
                  {lesson.completed ? 'Выполнено' : 'Видео-урок'}
                </span>
              </div>
              <div className="lesson__duration">
              {lesson.start ? formatDateTime(lesson.start) : ""} - {lesson.end ? formatTime(lesson.end) : ""}
              </div>
            </li>
            </Link>
          ))}
          
          {/* Отображение тестов */}
          {module.tests && module.tests.map((test) => (
            <Link to={test.completed_tests && test.completed_tests[0] && test.completed_tests[0].status === 'completed' ? `/test/results/${test.id}` : `/test/${test.id}`} className="module__lesson-link">
                <li key={`test-${test.id}`} className="module__lesson">
              <div className="lesson__icon test__icon">
                {getTestIcon( false)}
              </div>
              <div className="lesson__info">
                <p className="lesson__title">{test.name}</p>
                <span className={`lesson__type ${ 'lesson__type_test'}`}>
                  {test.completed_tests && test.completed_tests[0] && test.completed_tests[0].status === 'completed' ?'Тест выполнен' : 'Тест'}
                </span>
              </div>
              <div className="lesson__duration">
                {test.deadline ? new Date(test.deadline).toLocaleDateString("ru-RU") : ""}
              </div>
              
            </li>
            </Link>
          ))}
          {/* Отображение task */}
          {module.tasks && module.tasks.map((task) => (
            <Link to={`/task/${task.id}`} className="module__lesson-link">
                <li key={`test-${task.id}`} className="module__lesson">
              <div className="lesson__icon test__icon">
                {getTestIcon( false)}
              </div>
              <div className="lesson__info">
                <p className="lesson__title">{task.name}</p>
                <span className={`lesson__type ${ 'lesson__type_test'}`}>
                  {task.student_tasks && task.student_tasks[0] && task.student_tasks[0].status === 'completed' ? 'Задание выполнено'  : 'Задание'}
                </span>
              </div>
              <div className="lesson__duration">
                {task.deadline ? new Date(task.deadline).toLocaleDateString("ru-RU") : ""}
              </div>
            </li>
            </Link>
          ))}
          </ul>
      </div>
    </div>
  );
};

export default ModuleComponent;