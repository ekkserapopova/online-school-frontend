import { FC } from "react";
import "./LessonCard.css"
import { LessonWithCourse } from "../../modules/lesson";
import { parseISO, format } from 'date-fns';


interface LessonProps{
    lesson: LessonWithCourse
}


const LessonCard:FC<LessonProps> = ({lesson}) =>{
    
    const parsedDateStart = parseISO(lesson.lesson.start);
    const parsedDateEnd = parseISO(lesson.lesson.end);


    return (
        <>
                <div className="schedule__lesson-card">
                <div className="schedule__lesson-card__handler">
                    <div className="schedule__lesson-card__lesson-name">{lesson.lesson.name}</div>
                    <div className="schedule__lesson-card__course-name">{lesson.course_name}</div>
                </div>
                <div className="schedule__lesson-card__lesson-info">
                    <div className="schedule__lesson-card__lesson-date">Дата: {format(parsedDateStart, 'dd.MM.yyyy')}</div>
                    <div className="schedule__lesson-card__lesson-time">Время: {format(parsedDateStart, 'HH:mm')}-{format(parsedDateEnd, 'HH:mm')}</div>
                    <div className="schedule__lesson-card__teacher-name">Имя Фамилия</div>
                </div>
                <div className="schedule__bottom-btns">
                    <div className="schedule__bottom-btns__connect-btn">Подключиться к уроку</div>
                    <div className="schedule__bottom-btns__tocourse-btn">Перейти к курсу</div>
                </div>
                </div>
        </>
    )
}

export default LessonCard