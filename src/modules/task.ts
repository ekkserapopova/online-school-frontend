

export interface Task {
    id: number;
    name: string;
    description: string;
    deadline?: string;
    is_active: boolean;
    module_id?: number;
    student_tasks?: StudentTask[];

}

export interface StudentTask {
    id: number;
    task_id: number;
    student_id: number;
    code: string;
    status: string; 
    score: number;
    created_at: string;
    updated_at: string;
    recommendation: string;
    code_with_comments_by_llm: string;
}