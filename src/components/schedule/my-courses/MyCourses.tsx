import { FC, use, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './MyCourses.css';
import { OneCourse } from '../../../modules/courses';
import api from '../../../modules/login';

interface MyCoursesProps {
    courses: OneCourse[];
}

const MyCourses: FC<MyCoursesProps> = ({ courses }) => {
    const [photo, setPhoto] = useState<string | null>(null);
    const getPhoto = async () => {
        try {
            const response = await api.get('user/photo', { responseType: "blob" });
            const url = URL.createObjectURL(response.data);
            setPhoto(url);
        } catch (error) {
            console.error('Ошибка получения фото пользователя:', error);
            return null;
        }
    }

    useEffect(() => {
        getPhoto();
    }, []);
    
    return (
        <div className="my-courses">
            <div className="my-courses__header">
                <h2 className="my-courses__title">Мои курсы</h2>
            </div>

            <div className="my-courses__list">
                {courses.length > 0 ? (
                    courses.map(course => (
                        <div key={course.id} className="my-courses__course-card">
                            <div className="my-courses__course-card__image-container">
                                <img 
                                    src={photo ? photo : '../../default-course.jpg'} 
                                    alt={course.name} 
                                    className="my-courses__course-card__image" 
                                />
                            </div>
                            <div className="my-courses__course-card__content">
                                <h3 className="my-courses__course-card__title">{course.name}</h3>
                                <div className="my-courses__course-card__actions">
                                    <Link to={`/course/${course.id}`} className="my-courses__course-card__button my-courses__course-card__button--details">
                                        Детали курса
                                    </Link>
                                    <Link to={`/course/${course.id}`} className="my-courses__course-card__button my-courses__course-card__button--continue">
                                        Продолжить
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="my-courses__my-courses__empty">У вас нет курсов</div>
                )}
            </div>
        </div>
    );
};

export default MyCourses;
