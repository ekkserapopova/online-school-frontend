import { Language } from "./languages";
import { Module } from "./module";
import { StudentTask, Task } from "./task";
import { User } from "./user";

export const mockCourses: OneCourse[] = [
    {
        id: 1,
        name: "Курс 1",
        description: "крутой курс, советую",
        difficulty: 2,
        price: 1000,
        teacherID: 1,
        teacher: {id: 1, name: "Nukita", surname: "Kologrivi"}
    },
    {
        id: 2,
        name: "Курс 1",
        description: "крутой курс, советую",
        difficulty: 2,
        price: 1000,
        teacherID: 1, 
        teacher: {id: 2, name: "Nukita", surname: "Kologrivi"}
    },
   ];
   
export interface OneCourse {
    id: number,
    name: string,
    description: string,
    difficulty: number,
    price: number,
    teacherID: number,
    image: string
    teacher: User
    modules: Module[]
    tasks: Task[]
    languages: Language[]
}
   