// import { OneCourse } from "./courses";

import { Material } from "./material";
import { Module } from "./module";
import { Test } from "./test";

export interface Lesson {
    id: number;
    name: string;
    description?: string;
    start?: string;  
    end?: string;    
    is_active: boolean;
    module_id?: number
    module?: Module
    completed?: boolean; 
    type?: string; // 'video' | 'practice' | 'quiz' | 'project'
    materials?: Material[] | null;
}

export interface LessonWithCourse {
    lesson: Lesson;
    course_name: string;
}

