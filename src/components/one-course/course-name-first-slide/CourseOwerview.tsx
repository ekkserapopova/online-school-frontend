import React, { use, useEffect } from 'react';
import './CourseOwerview.css';
import { OneCourse } from '../../../modules/courses';
import axios from 'axios';
import { set } from 'date-fns';

interface CourseOverviewProps {
    course: OneCourse;
    onSubmit?: (id: number) => void;
    isEnrolled: boolean;
    type?: string;
    teacher?: string
}

const CourseOverview: React.FC<CourseOverviewProps> = ({ course, isEnrolled, type='course', teacher=''}) => {
    useEffect(() => {   
        console.log(teacher);
    }, [teacher]);
    return (
        <div className="course-overview">
            <h1 className="course-overview__title">{course.name}</h1>
            <p className="course-overview__description">{course.description}</p>
            {isEnrolled ? (
                type === 'course' && (
                <p style={{ fontFamily: "var(--font-family)", color: "var(--background-color)" }}>
                    Вы записаны на курс
                </p>)
            ) : (
                type === 'course' && (
                    <a 
                        className="course-overview__enroll-button" 
                        href={`/payment/${course.id}`}>
                        Записаться на курс
                    </a>
                )
            )}
            <div className="course-overview__additional-info">
            {type === 'course' ? (
                <>
                    <p>Преподаватель: {teacher || 'уточняется'}</p>
                    <p>Сложность: {course.difficulty >= 4 ? 'высокая' : (course.difficulty >= 2 ? 'средняя' : 'низкая')}</p>
                    <p>Формат: онлайн</p>
                    
                </>
            ) : (
                <>
                    <p>Современные технологии и практические задания</p>
                    <p>Поддержка наставников и сообщества</p>
                    <p>Гибкий график обучения</p>
                </>
            )}
            </div>
        </div>
    );
};

export default CourseOverview;