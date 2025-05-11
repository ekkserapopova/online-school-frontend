import React, { useEffect, useState } from 'react';
import CourseList from '../course-list/CourseList';
import CourseDetails from '../course-details/CourseDetails';
import './StudentDashboard.css';
import Navibar from '../../navbar/Navibar';
import api from '../../../modules/login';
import { OneCourse } from '../../../modules/courses';


 
export interface Course extends OneCourse{
  progress: number;
}

export interface Task {
  id: number;
  title: string;
  type: 'test' | 'assignment';
  completed: boolean;
  dueDate?: string;
}

const StudentDashboard: React.FC = () => {
const [courses, setCourses] = useState<Course[]>([])

  // Пример данных курсов
  const getCourses = async() =>{
    try{
      const response = await api.get("/courses/progress")
      const coursesData = response.data.progress
      setCourses(coursesData)
    } catch{
      console.log("Ошибка получения курсов")
    }
  }
  // const courses: Course[] = [
  //   {
  //     id: 1,
  //     title: 'Введение в программирование',
  //     progress: 75,
  //     tasks: [
  //       { id: 1, title: 'Основы алгоритмов', type: 'test', completed: true },
  //       { id: 2, title: 'Переменные и типы данных', type: 'test', completed: true },
  //       { id: 3, title: 'Циклы и условия', type: 'assignment', completed: true },
  //       { id: 4, title: 'Практический проект', type: 'assignment', completed: false, dueDate: '10.05.2025' }
  //     ]
  //   },
  //   {
  //     id: 2,
  //     title: 'Веб-разработка',
  //     progress: 40,
  //     tasks: [
  //       { id: 1, title: 'HTML и структура документа', type: 'test', completed: true },
  //       { id: 2, title: 'CSS основы', type: 'test', completed: true },
  //       { id: 3, title: 'JavaScript введение', type: 'test', completed: false },
  //       { id: 4, title: 'Адаптивная вёрстка', type: 'assignment', completed: false },
  //       { id: 5, title: 'Создание сайта-портфолио', type: 'assignment', completed: false, dueDate: '15.05.2025' }
  //     ]
  //   },
  //   {
  //     id: 3,
  //     title: 'Базы данных',
  //     progress: 90,
  //     tasks: [
  //       { id: 1, title: 'Реляционные базы данных', type: 'test', completed: true },
  //       { id: 2, title: 'SQL запросы', type: 'test', completed: true },
  //       { id: 3, title: 'Нормализация', type: 'assignment', completed: true },
  //       { id: 4, title: 'Проектирование БД', type: 'assignment', completed: true },
  //       { id: 5, title: 'Итоговый проект', type: 'assignment', completed: false, dueDate: '05.05.2025' }
  //     ]
  //   }
  // ];

  useEffect(() => {
      getCourses()
    }, []);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Обработчик выбора курса
  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
  };

  // Обработчик возврата к списку курсов
  const handleBackToList = () => {
    setSelectedCourse(null);
  };

  return (
    <>
    <Navibar />
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Прогресс обучения</h1>
        <div className="dashboard-summary">
          <div className="summary-item">
            <span className="summary-value">{courses.length}</span>
            <span className="summary-label">Активных курсов</span>
          </div>
          <div className="summary-item">
            <span className="summary-value">
              {Math.round(courses.reduce((acc, course) => acc + course.progress, 0) / courses.length)}%
            </span>
            <span className="summary-label">Общий прогресс</span>
          </div>
          <div className="summary-item">
            <span className="summary-value">
              {/* {courses.reduce((acc, course) => acc + course.tasks.filter(task => !task.completed).length, 0)} */}
            </span>
            <span className="summary-label">Заданий осталось</span>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        {selectedCourse ? (
          <CourseDetails course={selectedCourse} onBack={handleBackToList} />
        ) : (
          <CourseList courses={courses} onCourseSelect={handleCourseSelect} />
        )}
      </main>
    </div>
    </>
  );
};

export default StudentDashboard;