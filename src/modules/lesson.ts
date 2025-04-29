// import { OneCourse } from "./courses";

import { Module } from "./module";
import { Test } from "./test";

export interface Lesson {
    id?: number;
    name: string;
    description: string;
    start: string;  
    end: string;    
    courseID: number
    module: Module
    completed?: boolean; 
    type?: string; // 'video' | 'practice' | 'quiz' | 'project'

}

export interface LessonWithCourse {
    lesson: Lesson;
    course_name: string;
}

