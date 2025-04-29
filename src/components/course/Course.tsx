import { FC } from 'react'
import './Course.css'
import { OneCourse } from '../../modules/courses'

interface CourseProps {
    course: OneCourse;
    onSubmit: (id: number) => void;
}
const Course:FC<CourseProps> = ({
    course, onSubmit}) => {
    return (
        <>
            <div className="course-card" onClick={() => onSubmit(course.id)}>
                <img src="../../default-course.jpg" width={250} height={150} alt="" className="course-card__img" />
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