import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./TeacherCoursesPage.css";
import Navibar from "../../../../navbar/Navibar";
import axios from 'axios';
import { OneCourse } from "../../../../../modules/courses";

const TeacherCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<OneCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

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
      <h1 className="page-title">Мои курсы</h1>
      
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