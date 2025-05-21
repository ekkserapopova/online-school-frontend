import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./TeacherCoursesPage.css";
import Navibar from "../../../../navbar/Navibar";
import axios from 'axios';
import { OneCourse } from "../../../../../modules/courses";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store/store";

const TeacherCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<OneCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const user_name = useSelector((state: RootState) => state.auth.user_name);

  
  const navigate = useNavigate();
  const getGenitiveForm = (name: string | null): string => {
    if (!name) return '';
    
    // Правила преобразования имен в родительный падеж
    // Эти правила упрощенные и подходят для большинства русских имен
    
    // Женские имена, оканчивающиеся на "а" или "я"
    if (name.endsWith('а')) {
        return name.slice(0, -1) + 'ы';
    }
    if (name.endsWith('я')) {
        return name.slice(0, -1) + 'и';
    }
    
    // Мужские имена
    if (name === 'Фёдор' || name === 'Федор') return 'Федора';
    if (name === 'Артем' || name === 'Артём') return 'Артема';
    if (name === 'Александр') return 'Александра';
    if (name === 'Дмитрий') return 'Дмитрия';
    if (name === 'Сергей') return 'Сергея';
    if (name === 'Андрей') return 'Андрея';
    if (name === 'Николай') return 'Николая';
    if (name === 'Михаил') return 'Михаила';
    if (name === 'Иван') return 'Ивана';
    if (name === 'Павел') return 'Павла';
    
    // Для неизвестных имен добавляем окончание "а" (подойдет для большинства мужских имен)
    return name + 'а';
};

const genitiveUserName = getGenitiveForm(user_name);

  const getCourses = async () => {
    try {
        setLoading(true);
        const token = localStorage.getItem('auth_token');
        console.log(token)
        const response = await axios.get('http://localhost:8080/api/courses/teacher', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(response.data.courses || []);
      
        
        setError(null);
      } catch (err) {
        setError("Не удалось загрузить курсы. Пожалуйста, попробуйте позже.");
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    }

  
  useEffect(() => {
    getCourses();
  }, []);
  

  return (
    <>
    <Navibar />
    <div className="teacher-courses-page">
      <h1 className="page-title">Курсы {genitiveUserName}</h1>
      
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка курсов...</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {!loading && courses.length === 0 && !error && (
        <div className="empty-courses">
          <p>У вас пока нет курсов.</p>
        </div>
      )}
      
      <div className="courses-list">
        {courses.map(course => (
          <div key={course.id} className="course-container">
            <Link to ={`/course/edit/${course.id}`} className="course-header">
            
              <h2 className="course-title">{course.name}</h2>
            </Link>
            
          </div>
        ))}
      </div>
      <Link to="/create/course" className="teacher-courses-page__create-course-link"><button className="teacher-courses-page__create-course">Создать курс</button></Link>
    </div>
    </>
  );
};

export default TeacherCoursesPage;