import { FC, useEffect, useState } from "react";
import CourseOverview from "../components/one-course/course-name-first-slide/CourseOwerview";
import FAQ from "../components/one-course/faq/Faq";
import AboutCourse from "../components/one-course/advantages/AboutCourse";
import Navibar from "../components/navbar/Navibar";
import CourseProgram from "../components/one-course/structure/CourseProgram";
import api from "../modules/login";
import { OneCourse } from "../modules/courses";
import Foooter from "../components/footer/Foooter";


const CoursePage:FC = () => {
    const [course, setCourse] = useState<OneCourse>({} as OneCourse);
    const [isEnrolled, setIsEnrolled] = useState(false);
    // const searchParams = new URLSearchParams(window.location.search);
    const courseId = Number(window.location.pathname.split('/').pop());

    const getCourse = async (id:number) => {
        try{
            const response = await api.get(`/course/${id}`);
            const courseData = response.data.course;
            console.log(courseData);
            setCourse(courseData);
        } catch{
            console.error('Ошибка получения курса');
        }
    }

    // const enrollCourse = async (id:number) => {
    //     try{
    //         // const response = await api.post(`/enroll/${id}`);
    //         console.log(response.data);
    //     } catch{
    //         console.error('Ошибка записи на курс');
    //     }
    // }

    const isUserEnrolled = async (courseID:number) => {
        try{
            const response = await api.get(`/enrolled/course/${courseID}`);
            const isEnrolled = response.data.is_enrolled;
            setIsEnrolled(isEnrolled);
            console.log(isEnrolled);
        } catch{
            console.error('Ошибка проверки записи на курс');
        }
    }

    useEffect(() => {   
            console.log('Получение курса по ID:', courseId);
            getCourse(courseId);
            isUserEnrolled(courseId);
        }
        , []);

    return (
        <>
            <Navibar />
            <CourseOverview course={course}  isEnrolled={isEnrolled}/>
            <AboutCourse />
            <CourseProgram  modules={course.modules}/>
            <FAQ  />
            <Foooter/>
        </>
    );
}

export default CoursePage;