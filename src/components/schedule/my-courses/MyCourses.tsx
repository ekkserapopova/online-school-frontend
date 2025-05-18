import { FC, use, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './MyCourses.css';
import { OneCourse } from '../../../modules/courses';
import api from '../../../modules/login';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import axios from 'axios';

interface MyCoursesProps {
    courses: OneCourse[];
}

const MyCourses: FC<MyCoursesProps> = ({ courses }) => {
    const [photos, setPhotos] = useState<{ [key: number]: string | null }>({});
    const user_name = useSelector((state: RootState) => state.auth.user_name);

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
    
    // Получаем имя в родительном падеже
    const genitiveUserName = getGenitiveForm(user_name);
    

    const getPhoto = async (courseID: number) => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await axios.get(
              `http://localhost:8080/api/courses/${courseID}/image`,
              { 
                responseType: "blob",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const url = URL.createObjectURL(response.data);
            setPhotos(prev => ({ ...prev, [courseID]: url }));
        } catch (error) {
            console.error('Ошибка получения фото пользователя:', error);
            setPhotos(prev => ({ ...prev, [courseID]: null }));
        }
    };

    useEffect(() => {
        courses.forEach(course => {
            getPhoto(course.id);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courses]);
    
    return (
        <div className="my-courses">
            <div className="my-courses__header">
                <h2 className="my-courses__title">Курсы {genitiveUserName}</h2>
            </div>

            <div className="my-courses__list">
                {courses.length > 0 ? (
                    courses.map(course => (
                        <div key={course.id} className="my-courses__course-card">
                            <div>
                                <img 
                                    src={photos[course.id] || "../../../../default-course.jpg"}
                                    alt={course.name}
                                    // height={255}
                                    className="my-courses__course-card__image"
                                />
                            </div>
                            <div className="my-courses__course-card__content">
                                <h3 className="my-courses__course-card__title">{course.name}</h3>
                                <div className="my-courses__course-card__actions">
                                    <Link to={`/course/${course.id}`} className="my-courses__course-card__button my-courses__course-card__button--details">
                                        Детали курса
                                    </Link>
                                    {/* <Link to={`/course/${course.id}`} className="my-courses__course-card__button my-courses__course-card__button--continue">
                                        Продолжить
                                    </Link> */}
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
