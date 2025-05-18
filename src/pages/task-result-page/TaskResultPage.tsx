import { FC, useEffect, useState } from "react";
import AssignmentViewer from "../../components/task-result/TaskResult"
import Navibar from "../../components/navbar/Navibar";
import { StudentTask, Task } from "../../modules/task";
import axios from 'axios';

const TaskResultPage:FC = () => {
    const [task, setTask] = useState<Task | null>(null);
    const [studentTask, setStudentTask] = useState<StudentTask | null>(null);
    
    const taskID = Number(window.location.pathname.split('/').pop());

    const getTask = async () => {
        try{
            const response = await axios.get(
                `http://localhost:8080/api/tasks/${taskID}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("auth_token")}`
                    }
                }
            );
            const taskData = response.data.task;
            setTask(taskData);
        } catch (error) {
            console.error("Ошибка при получении данных задачи:", error);
        }
    }

    const getStudentTask = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/tasks/${taskID}/answer`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("auth_token")}`
                    }
                }
            );
            const taskData = response.data.task;
            setStudentTask(taskData);
        } catch (error) {
            console.error("Ошибка при получении данных задачи:", error);
        }
    }

    useEffect(() => {
        getTask();
        getStudentTask();
    }, []);

    return(
        <>
        <Navibar/>
        <AssignmentViewer
          title={task?.name ?? ""}
          description={task?.description ?? ""}
          code={studentTask?.code ?? ""}
          grade={studentTask?.score ?? 0}
          recommendations="Отлично! Функция написана лаконично и правильно. Можно добавить проверку типов для более надежного кода."
          dueDate={
            studentTask?.created_at
              ? new Date(studentTask.created_at).toLocaleString("ru-RU", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
              : ""
          }
        />
        </>
    )
}

export default TaskResultPage;