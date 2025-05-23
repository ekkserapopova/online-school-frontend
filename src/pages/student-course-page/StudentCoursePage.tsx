import React, { useEffect } from "react";
import "./StudentCoursePage.css";
import Navibar from "../../components/navbar/Navibar";
import ModuleComponent from "../../components/student-course-page/module/Module";
import api from "../../modules/login";
import { OneCourse } from "../../modules/courses";
import Foooter from "../../components/footer/Foooter";
import { User } from "../../modules/user";
import axios from 'axios';

const StudentCoursePage: React.FC = () => {
    // const { title, description, modules, teacher } = courseData;
    const [course, setCourse] = React.useState<OneCourse | null>(null);
    const courseID = Number(window.location.pathname.split('/').pop());
    const [teacher, setTeacher] = React.useState<User | null>(null);

    const getCourse = async (courseID: number) => {
        try {
            const token = localStorage.getItem("auth_token");
            if (!token) {
                console.log("Пользователь не авторизован!!!");
                return;
            }

            const course = await axios.get(
                `http://localhost:8080/api/courses/${courseID}/user`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(course.data);
            const courseData = course.data.course;
            setCourse(courseData);
            const teacherID = courseData.teacher_id;
            getCourseTeacher(teacherID);

        }
        catch (error) {
            console.error("Ошибка при получении данных курса:", error);
        }
    };

    const getCourseTeacher = async (teacherID: number) => {
        try {
            const token = localStorage.getItem("auth_token");
            const response = await axios.get(
                `http://localhost:8080/api/user/${teacherID}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const teacherData = response.data;
            console.log(teacherData);
            setTeacher(teacherData);
        }
        catch (error) {
            console.error("Ошибка при получении данных преподавателя:", error);
        }
    };

    useEffect(() => {
        getCourse(courseID);
    }
    , []);

    const totalProgress = 75

    return (
        <>
            <Navibar />
            <div className="student-course">
                <div className="student-course__header">
                    <div className="student-course__info">
                        <h1 className="student-course__title">{course && course.name}</h1>
                        <p className="student-course__description">{course && course.description}</p>
                        <div className="student-course__teacher">
                            Преподаватель: {teacher && `${teacher.name} ${teacher.surname}`}
                        </div>
                    </div>
                </div>
                <div className="student-course__modules-header">
                    <h2 className="student-course__modules-title">Модули курса</h2>
                </div>
                <div className="student-course__modules-list">
                    {course && course.modules.map((module, index) => (
                        <ModuleComponent 
                            index={index} 
                            module={module}
                        />
                    ))}
                </div>
            </div>
            <Foooter />
        </>
    );
};

export default StudentCoursePage;