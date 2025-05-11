import { Lesson } from "./lesson";
import { Material } from "./material";
import { Task } from "./task";
import { Test } from "./test";

export interface Module {
    id: number;
    name: string;
    description: string; 
    lessons?: Lesson[];
    tests?: Test[];
    tasks: Task[];
    materials?: Material[];
    progress: number;
}