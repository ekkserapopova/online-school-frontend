import { FC, useEffect, useState } from "react";
import CourseOverview from "../components/one-course/course-name-first-slide/CourseOwerview";
import Navibar from "../components/navbar/Navibar";
import { OneCourse } from "../modules/courses";
import axios from 'axios';
import { User } from "../modules/user";


const CoursePage:FC = () => {
    const [course, setCourse] = useState<OneCourse>({} as OneCourse);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [teacher, setTeacher] = useState({} as User);
    const [isLoading, setIsLoading] = useState(true);
    // const searchParams = new URLSearchParams(window.location.search);
    const courseId = Number(window.location.pathname.split('/').pop());

    const getCourse = async (id:number) => {
        try{
            const authToken = localStorage.getItem('auth_token');
            const response = await axios.get(`http://localhost:8080/api/courses/${id}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            const courseData = response.data.course;
            console.log(courseData);
            setCourse(courseData);
            if (courseData){
                await getTeacher(courseData.teacher_id);
            }
        } catch{
            console.error('Ошибка получения курса');
        }
    }

    const getTeacher = async (id:number) => {
        try{
            setIsLoading(true);
            const authToken = localStorage.getItem('auth_token');
            const response = await axios.get(`http://localhost:8080/api/user/${id}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            const teacherData = response.data;
            console.log(teacherData);
            setTeacher(teacherData);
            setIsLoading(false);
        } catch{
            console.error('Ошибка получения teacher');
        }
    }

    // const enrollCourse = async (id:number) => {
    //     try{
    //         // const response = await axios.post(`/enroll/${id}`);
    //         console.log(response.data);
    //     } catch{
    //         console.error('Ошибка записи на курс');
    //     }
    // }

    const isUserEnrolled = async (courseID:number) => {
        try{
            const authToken = localStorage.getItem('auth_token');
            const response = await axios.get(`http://localhost:8080/api/courses/${courseID}/enrolled`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
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
            {/* {isLoading && */}
            <CourseOverview course={course}  isEnrolled={isEnrolled} teacher={teacher?.name && teacher?.surname ? `${teacher.name} ${teacher.surname}` : ""}/>
            {/* } */}
            {/* <Foooter/> */}
        </>
    );
}

export default CoursePage;