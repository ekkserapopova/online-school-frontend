import { FC, useEffect, useState } from 'react'
import './Course.css'
import { OneCourse } from '../../modules/courses'
import axios from 'axios';

interface CourseProps {
    course: OneCourse;
    onSubmit: (id: number) => void;
}
const Course:FC<CourseProps> = ({
    course, onSubmit}) => {
    const [photos, setPhotos] = useState<{ [key: number]: string | null }>({});
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
            getPhoto(course.id);
        }, [course.id]);
    return (
        <>
            <div className="course-card" onClick={() => onSubmit(course.id)}>
                <img src={photos[course.id]  || "../../default-course.jpg"} className="course-card__img" width={250} height={150} alt=""  />
                <div className="course-card__description">
                    <div className="course-card__description__name">{course.name}</div>
                    <div className="course-card__description__overview">{course.description}</div>
                    <div className="course-card__description__price">Цена: 0у.е.</div>
                </div>
                
            </div>
        </>
    )
}

export default Course