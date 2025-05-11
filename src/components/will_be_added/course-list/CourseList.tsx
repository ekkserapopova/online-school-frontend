import React, { useState } from 'react';
import { Course } from '../student-dashboard/StudentDashboard';
import ProgressBar from '../progress-bar/ProgressBar';
import './CourseList.css';

interface CourseListProps {
  courses: Course[];
  onCourseSelect: (course: Course) => void;
}

const CourseList: React.FC<CourseListProps> = ({ courses, onCourseSelect }) => {
  const [open, setOpen] = useState<boolean>(false)
  const handleToSeeTasks = () =>{
    setOpen(!open)
  }
  return (
    <div className="course-list-container">
      <h2>Ваши курсы</h2>
      
      <div className="courses-grid">
        {courses.map(course => (
          <div 
            key={course.id} 
            className="course-progress-card"
            onClick={() => onCourseSelect(course)}
          >
            <div className="course-info">
              <h3>{course.name}</h3>
              <div className="course-stats">
                <span className="progress-value">{course.progress}%</span>
                <span className="tasks-count">
                  {course.tasks ? course.tasks.filter(task => task.student_tasks[0].status == 'completed').length / course.tasks.length : 0} заданий
                </span>
              </div>
            </div>
            
            <ProgressBar progress={course.progress} status={getProgressStatus(course.progress)} />
            
            <div className="course-footer">
              <button className="course-button" onClick={handleToSeeTasks}>
                Просмотреть задания
              </button>
            </div>
            {/* {
              open &&
              div.course
            } */}
          </div>
        ))}
      </div>
    </div>
  );
};

// Функция для определения статуса прогресса
const getProgressStatus = (progress: number): 'low' | 'medium' | 'high' | 'complete' => {
  if (progress < 30) return 'low';
  if (progress < 60) return 'medium';
  if (progress < 100) return 'high';
  return 'complete';
};

export default CourseList;