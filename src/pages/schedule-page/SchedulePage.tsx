import React, { useEffect, useState } from 'react';
import './SchedulePage.css';
import api from '../../modules/login';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Navibar from '../../components/navbar/Navibar';
import LessonCard from '../../components/schedule/lesson-card/LessonCard';
import { LessonWithCourse } from '../../modules/lesson';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../store/slices/authSlice';
import ArchiveTable from '../../components/schedule/archive-table/ArchiveTable';
import MyCourses from '../../components/schedule/my-courses/MyCourses';
import { OneCourse } from '../../modules/courses';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CalendarPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [activeBtn, setActiveBtn] = useState('mycourses');
    const [myCourses, setMyCourses] = useState<OneCourse[]>([]);
    const [lessons, setLessons] = useState<LessonWithCourse[]>([]);

    
    const userId = useSelector((state: RootState) => state.auth.user_id);
    const is_authenticated = useSelector((state: RootState) => state.auth.is_authenticated);

    const navigate = useNavigate(); 
    const dispatch = useDispatch();
    
    
    useEffect(() => {
        if (userId) {
            getLessons();
        }
    }, [userId]);
    
    const getLessons = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {} as any,
            };
            const responseLessons = await axios.get(
                `http://localhost:8080/api/lessons`,
                config
            );
            const mycourses = await axios.get(
                `http://localhost:8080/api/courses/user`,
                config
            );
            console.log('Мои курсы:', mycourses.data.courses);
            const enrolledCourses = mycourses.data.courses || [];
            setMyCourses(enrolledCourses);
            const lessonsData = responseLessons.data.lessons || [];
            setLessons(lessonsData);
        } catch (error:any) {
            if (error.response && error.response.status === 401){
                console.log('Ошибка 401: Не авторизован');
                localStorage.removeItem('auth_token');
                dispatch(
                    loginUser({
                        user_id: null,
                        is_authenticated: false,
                        user_name: null
                    })
                );
                navigate('/login');
            } else {
                console.error('Ошибка получения расписания', error);
                // Set empty arrays in case of error
                setMyCourses([]);
                setLessons([]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Component for empty courses state
    const EmptyCoursesMessage = () => (
        <div className="empty-courses-container">
            <div className="empty-courses-message">
                <h2>У вас пока нет курсов</h2>
                <p>Запишитесь на курсы, чтобы начать обучение</p>
            </div>
        </div>
    );

    // Component for empty lessons state
    const EmptyLessonsMessage = () => (
        <div className="empty-lessons-container">
            <div className="empty-lessons-message">
                <h2>У вас пока нет уроков</h2>
                <p>Записанные уроки будут появляться здесь</p>
            </div>
        </div>
    );

    return (
        <div>
            <Navibar />
            {isLoading ? (
                <div className="schedule-page">
                    <div className="loading">Загрузка уроков...</div>
                </div>
            ) : (
                is_authenticated ? (
                    <div className="schedule-page">
                        <div className="schedule__handler">
                            <div 
                                className={`schedule__btn--courses ${activeBtn === 'mycourses' ? 'schedule__btn--courses--active' : ''}`} 
                                onClick={() => setActiveBtn('mycourses')}
                            >
                                Мои курсы
                            </div>
                            <div 
                                className={`schedule__btn--archive ${activeBtn === 'archive' ? 'schedule__btn--archive--active' : ''}`} 
                                onClick={() => setActiveBtn('archive')}
                            >
                                Уроки
                            </div>
                        </div>
                        
                        {/* Архив уроков */}
                        {activeBtn === 'archive' && (
                            <div className="schedule__archive">
                                {lessons && lessons.length > 0 ? (
                                    <ArchiveTable lessons={lessons} />
                                ) : (
                                    <EmptyLessonsMessage />
                                )}
                            </div>
                        )}

                        {/* Мои курсы */}
                        {activeBtn === 'mycourses' && (
                            <div className="schedule__mycourses">
                                {myCourses && myCourses.length > 0 ? (
                                    <MyCourses courses={myCourses} />
                                ) : (
                                    <EmptyCoursesMessage />
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="schedule-page__unauthorized">
                        <h2>Необходимо авторизоваться</h2>
                        <p>Пожалуйста, войдите в свой аккаунт, чтобы просматривать расписание и ваши курсы</p>
                    </div>
                )
            )}
        </div>  
    );
};

export default CalendarPage;