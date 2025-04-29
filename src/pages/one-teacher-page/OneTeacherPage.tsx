import React from "react";
import Navibar from "../../components/navbar/Navibar";

interface Course {
  id: number;
  title: string;
}

interface Teacher {
  name: string;
  description: string;
  courses: Course[];
}

const teacher: Teacher = {
  name: "Иван Петров",
  description: "Доцент кафедры математики. Опыт преподавания - 10 лет.",
  courses: [
    { id: 1, title: "Линейная алгебра" },
    { id: 2, title: "Математический анализ" },
  ],
};

const OneTeacherPage: React.FC = () => {
  return (
    <>
    <Navibar/>
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Преподаватель</h1>
      <div className="p-4 border rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-semibold">{teacher.name}</h2>
        <p className="text-gray-700 mb-2">{teacher.description}</p>
        <h3 className="font-medium">Курсы:</h3>
        <ul className="list-disc pl-5 text-gray-600">
          {teacher.courses.map((course) => (
            <li key={course.id}>{course.title}</li>
          ))}
        </ul>
      </div>
    </div>
    </>
  );
};

export default OneTeacherPage;