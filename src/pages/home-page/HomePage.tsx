import React from "react";
import "./HomePage.css";
import Navibar from "../../components/navbar/Navibar";
import CourseOverview from "../../components/one-course/course-name-first-slide/CourseOwerview";
import AboutCourse from "../../components/one-course/advantages/AboutCourse";
import FAQ from "../../components/one-course/faq/Faq";
import Foooter from "../../components/footer/Foooter";
import Innovation from "../../components/innovation/Innovation";

const HomePage: React.FC = () => {
  const course = {
    id: 1,
    name: "Онлайн-школа по программированию",
    description: "Изучайте программирование с нуля до профессионала",
    image: "/images/course-image.jpg",
    duration: "Разное время обучения",
    format: "Онлайн",
    level: "Начальный",
    difficulty: 3,
    price: 0,
    teacherID: 1,
    teacher: {
      id: 1,
      name: "Иван Иванов",
      bio: "Опытный преподаватель программирования",
      avatar: "/images/teacher-avatar.jpg"
    },
    lessons: [],
    reviews: [],
    tags: [],
    modules: [],
    tasks: [],
    languages: []
  };

  const task_description = "Напишиите программу на языке Python, которая находит сумму чисел в списке."

  const student_code = `def kotik(lst):
  sum = 0
  for i in len(lst):
    sum += lst[i]
    
  return sum`

  const llm_answer = `def kotik(lst):# Неинформативное название функции, лучше использовать calculate_sum
  sum = 0  # 'sum' - это зарезервированное имя встроенной функции Python!
  for i in len(lst):  # Ошибка в использовании len. Требуется использовать 
                #'range(len(lst))'!
    sum += lst[i]
    
  return sum`

  const feedback='Код содержит ошибки, связанные с использованием функции `len` и цикла `for`, из-за чего оценивается не очень высоко. Рекомендации: исправить ошибки, использовать правильные методы для обхода списка (`for i in lst:`), чтобы избежать синтаксических и логических ошибок, и усовершенствовать именование переменной `sum`, так как это также имя встроенной функции. Рекомендуется также использовать более осмысленные имена переменных и функций, чтобы код был более читабельным.'
  return (
    <>
            <Navibar />
            <CourseOverview course={course}  isEnrolled={true} type='home'/>
            
            <AboutCourse />
            <Innovation student_code={student_code} answer_by_llm={llm_answer} task_description={task_description} feedback={feedback} />
            <FAQ  />
            <Foooter/>
        </>
  );
};

export default HomePage;