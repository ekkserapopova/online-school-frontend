import { FC, useEffect, useState } from "react";
import CodeEditor from "../../components/code-editor/CodeEditor";
import Navibar from "../../components/navbar/Navibar";
import { StudentTask, Task } from "../../modules/task";
import api from "../../modules/login";
import TaskAttemptsList from "../../components/task-attempts/TaskAttemptsList";
import AssignmentViewer from "../../components/task-result/TaskResult";
import "./CodePage.css";

const CodePage: FC = () => {
    const [task, setTask] = useState<Task | null>(null);
    const [code, setCode] = useState<string>("");
    const [attempts, setAttempts] = useState<StudentTask[]>([]);
    const [activeAttemptId, setActiveAttemptId] = useState<number | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [isEditorMode, setIsEditorMode] = useState<boolean>(true);
    const [selectedAttempt, setSelectedAttempt] = useState<StudentTask | null>(null);
    const [finalScore, setFinalScore] = useState<number | null>(null);

    const taskID = Number(window.location.pathname.split('/').pop());

    const getTask = async () => {
        try {
            const response = await api.get(`/task/${taskID}`);
            const taskData = response.data.task;
            setTask(taskData);
            
            // Устанавливаем начальный код, если он есть в задаче и нет активных попыток
            if (taskData.template_code && !activeAttemptId) {
                setCode(taskData.template_code);
            }
        } catch (error) {
            console.error("Ошибка при получении данных задачи:", error);
        } finally {
            setLoading(false);
        }
    };

    const getTaskAttempts = async () => {
        try {
            const response = await api.get(`/task/${taskID}/answers`);
            const attemptsData = response.data.tasks;
            
            setAttempts(attemptsData || []);
            
            console.log("Попытки решения задачи:", attemptsData);
            if (attemptsData && attemptsData.length > 0) {
                const latestAttempt = attemptsData[0]; 
                setCode(latestAttempt.code);
                setActiveAttemptId(latestAttempt.id);
                setSelectedAttempt(latestAttempt);
                setIsEditorMode(false); 
            } else {
                setIsEditorMode(true);
            }
        } catch (error) {
            console.error("Ошибка при получении истории решений:", error);
        }
    };

    const addStudentTask = async () => {
        try {
            setLoading(true);
            const response = await api.post(`/task/${taskID}/answer`, {
                code: code,
            });
            console.log("Ответ успешно отправлен:", response.data.student_task);
            
            // Обновляем список попыток после отправки
            await getTaskAttempts();
            console.log("Айди отправленного задания:", response.data.student_task.task_id);
            await pollTaskStatus(response.data.student_task.task_id);
        } catch (error) {
            console.error("Ошибка при отправке ответа:", error);
        } finally {
            setLoading(false);
        }
    };

    const getFinalScore = async(taskId: number) => {
        try {
            const response = await api.get(`/task/${taskId}/score`);
            const finalScoreData = Math.round(response.data.score * 100) / 100;
            console.log("Итоговая оценка:", finalScoreData);
            setFinalScore(finalScoreData);
        } catch (error) {
            console.error("Ошибка при получении итоговой оценки:", error);
        }
    };

    
    // Функция для лонг поллинга статуса задачи
    const pollTaskStatus = async (taskId: number) => {
        const maxAttempts = 15; // максимальное количество попыток
        const delay = 2000; // задержка между запросами в мс (2 секунды)
        let attempts = 0;
        
        const checkStatus = async () => {
            try {
                const response = await api.get(`/task/${taskId}/answer`);
                const taskData = response.data.task;
                
                // Проверяем изменился ли статус задачи
                if (taskData && taskData.status !== 'in progress') {
                    console.log(`Задача обработана, статус: ${taskData.status}`);
                    
                    // Обновляем список попыток после обработки
                    await getTaskAttempts();
                    setLoading(false);
                    return true;
                } else {
                    attempts++;
                    if (attempts >= maxAttempts) {
                        console.log("Превышено максимальное количество попыток проверки статуса");
                        setLoading(false);
                        return true;
                    }
                    
                    // Продолжаем проверять
                    return false;
                }
            } catch (error) {
                console.error("Ошибка при проверке статуса задачи:", error);
                setLoading(false);
                return true;
            }
        };
        
        // Рекурсивная функция для повторных запросов с задержкой
        const poll = async () => {
            const completed = await checkStatus();
            if (!completed) {
                await new Promise(resolve => setTimeout(resolve, delay));
                await poll();
            }
        };
        
        await poll();
    };

    // Обновленный обработчик выбора попытки
    const handleSelectAttempt = (attemptCode: string, attemptId: number) => {
        setCode(attemptCode);
        setActiveAttemptId(attemptId);
        
        // Найдем полную информацию о выбранной попытке
        const attempt = attempts.find(a => a.id === attemptId);
        if (attempt) {
            setSelectedAttempt(attempt);
            setIsEditorMode(false); // Показываем режим просмотра при выборе попытки
        }

        console.log("Выбрана попытка:", attempt);
    };

    // Функция для перехода в режим редактирования
    const handleSolveAgain = () => {
        setIsEditorMode(true);
        // Можно установить шаблонный код или оставить текущий код
        // if (task && task.template_code) {
        //     setCode(task.template_code);
        // }
        setActiveAttemptId(undefined);
    };

    // Форматирование даты для отображения в TaskResult
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    useEffect(() => {
        getTask();
        getTaskAttempts();
        getFinalScore(taskID)
    }, [taskID]);

    // Удаляем кнопку "Решить еще раз" из блока результата
// и передаем обработчик в компонент TaskAttemptsList

return (
    <div className="code-page">
        <Navibar />
        <div className="code-page__content">
            <TaskAttemptsList 
                attempts={attempts}
                taskId={taskID}
                onSelectAttempt={handleSelectAttempt}
                activeAttemptId={activeAttemptId}
                onSolveAgain={handleSolveAgain} 
                finalscore={finalScore}                
            />
            
            <div className="code-page__editor-container">
                {isEditorMode ? (
                    // Режим редактирования - показываем CodeEditor
                    <CodeEditor 
                        code={code}
                        setCode={setCode}
                        onSubmit={addStudentTask}
                        title={task ? task.name : undefined}
                        description={task ? task.description : undefined}
                    />
                ) : (
                    // Режим просмотра - показываем TaskResult без кнопки "Решить еще раз"
                    <div className="task-result-container">
                        <AssignmentViewer 
                            title={task?.name || ''}
                            description={task?.description || ''}
                            code={selectedAttempt?.code_with_comments_by_llm || selectedAttempt?.code || ''}
                            grade={selectedAttempt?.score ?? 0}
                            recommendations={selectedAttempt?.recommendation ??'Нет обратной связи от преподавателя'}
                            dueDate={formatDate(selectedAttempt?.created_at || '')}
                        />
                    </div>
                )}
            </div>
        </div>
    </div>
);
};

export default CodePage;