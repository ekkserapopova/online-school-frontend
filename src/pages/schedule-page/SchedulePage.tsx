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

const CalendarPage: React.FC = () => {
    const [futureLessons, setFutureLessons] = useState<LessonWithCourse[]>([]); 
    const [pastLessons, setPastLessons] = useState<LessonWithCourse[]>([]); 
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [activeBtn, setActiveBtn] = useState('mycourses');
    const [myCourses, setMyCourses] = useState<OneCourse[]>([]); 
    
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
            const responsePast = await api.get(`/lessons`, {params: {period: 'past'}});
            const responseFuture = await api.get(`/lessons`, {params: {period: 'future'}});
            const mycourses = await api.get(`/courses/user`);
            console.log('Мои курсы:', mycourses.data.courses);
            const enrolledCourses = mycourses.data.courses;
            setMyCourses(enrolledCourses);
            const pastLessonsData = responsePast.data.lessons;
            const futureLessonsData = responseFuture.data.lessons;
            setPastLessons(pastLessonsData);
            setFutureLessons(futureLessonsData);
            console.log('Расписание уроков:', futureLessonsData);
            console.log('Архив уроков:', pastLessonsData);
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
            }
        } finally {
            setIsLoading(false);
        }
    };

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
                                className={`schedule__btn--schedule ${activeBtn === 'schedule' ? 'schedule__btn--schedule--active' : ''}`} 
                                onClick={() => setActiveBtn('schedule')}
                            >
                                Расписание
                            </div>
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
                                Архив
                            </div>
                        </div>
                        
                        {activeBtn === 'schedule' && (
                            <div className="schedule__schedule">
                                <div className="schedule__lessons">
                                {futureLessons && futureLessons.length > 0 ?
                                    futureLessons.map((lesson) => (
                                        lesson && lesson.lesson ? (
                                            <LessonCard key={lesson.lesson.id} lesson={lesson} />
                                        ) : null
                                    ))
                                    : <div className="loading">Нет уроков...</div>
                                }
                                
                                </div>
                            </div>
                        )}
                        
                        {/* Архив уроков */}
                        {activeBtn === 'archive' && (
                            <div className="schedule__archive">
                                <ArchiveTable lessons={pastLessons} />
                            </div>
                        )}

                        {/* Мои курсы */}
                        {activeBtn === 'mycourses' && (
                            <div className="schedule__mycourses">
                                <MyCourses courses={myCourses} />
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