import { Module } from "./lesson";
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
    teacherID: number
    teacher: User
    modules: Module[]
}
   