import React from "react";
import "./CourseProgram.css";
import ModuleComponent from "../../student-course-page/module/Module";
import { Module } from "../../../modules/lesson";


interface CourseProgramProps {
  title?: string;
  subtitle?: string;
  modules: Module[];
}


const CourseProgram: React.FC<CourseProgramProps> = ({
  title = "Программа курса",
  subtitle = "Подробный план обучения, разбитый на модули и уроки",
  modules,
}) => {
  return (
    <div className="course-program">
      <div className="program__header">
        <h2 className="program__title">{title}</h2>
        <p className="program__subtitle">{subtitle}</p>
      </div>
      <div className="program__modules">
        {modules && modules.map((module, moduleIndex) => (
          <ModuleComponent 
            key={moduleIndex} 
            module={{
              id: module.id || moduleIndex,
              name: module.name || "Без названия",
              description: module.description,
              progress: module.progress || 0,
              lessons: module.lessons && module.lessons.map(lesson => ({
                ...lesson
              }))
            }}
            index={moduleIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseProgram;