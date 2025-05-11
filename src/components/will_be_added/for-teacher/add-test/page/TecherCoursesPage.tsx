import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TeacherCoursesPage.css";
import api from "../../../../../modules/login";
import { Test } from "../../../../../modules/test";
import { Module } from "../../../../../modules/module";
import { Course } from "../../../student-dashboard/StudentDashboard";

const TeacherCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openCourseId, setOpenCourseId] = useState<number | null>(null);
  const [openModuleId, setOpenModuleId] = useState<number | null>(null);
  
  const navigate = useNavigate();

  const getCourses = async () => {
    try {
        setLoading(true);
        const response = await api.get('/courses/teacher');
        setCourses(response.data.courses || []);
        
        // Если есть курсы, открыть первый по умолчанию
        if (response.data.courses && response.data.courses.length > 0) {
          setOpenCourseId(response.data.courses[0].id);
        }
        
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
  
  const toggleCourse = (courseId: number) => {
    setOpenCourseId(openCourseId === courseId ? null : courseId);
    setOpenModuleId(null);
  };
  
  const toggleModule = (moduleId: number) => {
    setOpenModuleId(openModuleId === moduleId ? null : moduleId);
  };
  
  const navigateToCreateTest = (moduleId: number) => {
    navigate(`/module/${moduleId}/createtest`);
  };
  
  const navigateToEditTest = (testId: number) => {
    navigate(`/test/${testId}/edit`);
  };
  
  
  const getModuleItemsCount = (module: Module) => {
    let count = 0;
    if (module.lessons?.length) count += module.lessons.length;
    if (module.tests?.length) count += module.tests.length;
    if (module.tasks?.length) count += module.tasks.length;
    return count;
  };

  return (
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
            <div 
              className={`course-header ${openCourseId === course.id ? 'active' : ''}`} 
              onClick={() => toggleCourse(course.id)}
            >
              <h2 className="course-title">{course.name}</h2>
              <div className="course-toggle">
                <span></span>
                <span></span>
              </div>
            </div>
            
            {openCourseId === course.id && (
              <div className="course-content">
                <p className="course-description">{course.description}</p>
                
                <div className="modules-list">
                  <h3>Модули курса</h3>
                  
                  {course.modules?.length === 0 ? (
                    <p className="empty-modules">В этом курсе пока нет модулей.</p>
                  ) : (
                    <ul>
                      {course.modules?.map((module, index) => (
                        <li key={module.id} className="module-container">
                          <div 
                            className={`module-item ${openModuleId === module.id ? 'active' : ''}`}
                            onClick={() => toggleModule(module.id)}
                          >
                            <div className="module-number">{index + 1}</div>
                            <div className="module-info">
                              <h4 className="module-title">{module.name}</h4>
                              <p className="module-meta">
                                {getModuleItemsCount(module) > 0 ? `${getModuleItemsCount(module)} элементов` : 'Нет элементов'}
                              </p>
                            </div>
                            <div className="module-navigate">
                              <svg viewBox="0 0 24 24" width="24" height="24">
                                <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                              </svg>
                            </div>
                          </div>
                          
                          {openModuleId === module.id && (
                            <div className="module-tests">
                              <h4>Тесты модуля</h4>
                              
                              {!module.tests || module.tests.length === 0 ? (
                                <p className="empty-tests">В этом модуле пока нет тестов.</p>
                              ) : (
                                <ul className="tests-list">
                                  {module.tests.map(test => (
                                    <li 
                                      key={test.id} 
                                      className="test-item"
                                      onClick={() => navigateToEditTest(test.id)}
                                    >
                                      <div className="test-info">
                                        <h5 className="test-title">{test.name}</h5>
                                        {test.description && <p className="test-description">{test.description}</p>}
                                      </div>
                                      <div className="test-status">
                                        {test.is_active ? (
                                          <span className="status active">Активен</span>
                                        ) : (
                                          <span className="status inactive">Неактивен</span>
                                        )}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              )}
                              
                              <button 
                                className="add-test-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigateToCreateTest(module.id);
                                }}
                              >
                                <svg viewBox="0 0 24 24" width="16" height="16">
                                  <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                </svg>
                                Добавить тест
                              </button>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherCoursesPage;