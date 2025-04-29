import { FC, useEffect, useState } from "react";
import TeacherCard from "../../components/teacher-card/TeacherCard";
import Navibar from "../../components/navbar/Navibar";
import "./TeachersPage.css";
import api from "../../modules/login";

export interface Teacher{
    id?: number,
    name: string,
    surname: string,
    description: string,
}

const TeachersPage: FC = () => {
    // const teachers = Array(10).fill(null); // Имитация массива карточек
    const [teachers, setTeachers] = useState<Teacher[] | null>(null);
    const hasManyTeachers = teachers && teachers.length > 4;

    const get_teachers = async() =>{
        try{
            const response = api.get("/teachers")
            const teachersData = (await response).data.teachers
            setTeachers(teachersData)
        } catch{
            console.log("Ошибка в получении списка учителей")
        }
    }

    useEffect(() =>{
        get_teachers()
    },[])
    return (
        <>
            <Navibar />
            <div 
                className="teachers" 
                style={{ 
                    gap: hasManyTeachers ? "0px" : "64px", 
                    justifyContent: hasManyTeachers ? "space-between" : "flex-start" 
                }}
            >
                {teachers && teachers.map((teacher, index) => (
                    <TeacherCard name={teacher.name} 
                                surname={teacher.surname}
                                description={teacher.description} 
                                key={teacher.id || index} />
                ))}
            </div>
        </>
    );
};

export default TeachersPage;
