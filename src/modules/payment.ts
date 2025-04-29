import { OneCourse } from "./courses";
import { User } from "./user";

export interface Payment {
    id: number;
    userID: number;
    courseID: number;
    status: string;
    amount: number
    student: User;
    course: OneCourse
}