
export interface Test {
    id: number;
    name: string;
    description?: string;
    lesson_id?: number;
    course_id?: number;
    deadline?: string;
    questions?: Question[];
    completed_tests?: CompletedTests[]
    time_limit?: number;
    count_questions?: number;
    is_active?: boolean;
}

export interface CompletedTests {
    id: number;
    test_id: number;
    student_id: number;
    points: number;
    status: string;
}

export interface Question {
    id: number;
    text: string;
    test_id: number;
    answers: AnswerVariant[];
    srudent_answers: StudentAnswer[];
    points: number;
}

export interface AnswerVariant{
    id: number;
    number_id: number;
    text: string;
    question_id: number;
    is_right: boolean;
}

export interface StudentAnswer {
    id: number;
    question_id: number;
    student_id: number;
    selected_answer_id: number;
    result: boolean;
    points_earned: number;
    is_right: boolean;
}