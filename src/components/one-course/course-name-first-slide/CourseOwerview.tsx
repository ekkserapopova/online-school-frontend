import React from 'react';
import './CourseOwerview.css';
import { OneCourse } from '../../../modules/courses';

interface CourseOverviewProps {
    course: OneCourse;
    onSubmit?: (id: number) => void;
    isEnrolled: boolean;
}

const CourseOverview: React.FC<CourseOverviewProps> = ({ course, isEnrolled}) => {
    return (
        <div className="course-overview">
            <h1 className="course-overview__title">{course.name}</h1>
            <p className="course-overview__description">{course.description}</p>
            {isEnrolled ? (
                <p style={{ fontFamily: "var(--font-family)", color: "var(--background-color)" }}>
                    Вы записаны на курс
                </p>
            ) : (
                <a 
                    className="course-overview__enroll-button" 
                    href={`/payment/${course.id}`}>
                    Записаться на курс
                </a>
            )}
            <div className="course-overview__additional-info">
                <p>Длительность курса: 8 недель</p>
                <p>Формат: Онлайн</p>
                <p>Уровень: Начальный</p>
            </div>
        </div>
    );
};

export default CourseOverview;