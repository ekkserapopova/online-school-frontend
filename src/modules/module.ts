import { Lesson } from "./lesson";
import { Task } from "./task";
import { Test } from "./test";

export interface Module {
    id: number;
    name: string;
    description: string;
    lessons?: Lesson[];
    tests?: Test[];
    tasks?: Task[];
    progress: number;
}