import React, { useState } from 'react';
import QuestionsList from '../question-list/QuestionsList';
import QuestionForm from '../question-form/QuestionForm';
import TestSettings from '../test-settings/TestSettings';
import './TestConstructor.css';
import { Question, Test } from '../../../../../modules/test';

interface TestConstructorProps {
    onSubmitCreateTest: () => void;
}

const TestConstructor: React.FC<TestConstructorProps> = ({onSubmitCreateTest}) => {
    const [test, setTest] = useState<Test>({
        id: Date.now(),
        name: '',
        description: '',
        lesson_id: 0,
        course_id: 0,
        deadline: '',
        questions: [],
        completed_tests: []
    });


    const addQuestion = (question: Question) => {
        setTest(prevTest => ({
            ...prevTest,
            questions: [...prevTest.questions, question]
        }));
    };

    const removeQuestion = (questionId: number) => {
        setTest(prevTest => ({
            ...prevTest,
            questions: prevTest.questions.filter(q => q.id !== questionId)
        }));
    };

    const handleTestSettingsChange = (settings: Partial<Test>) => {
        setTest(prevTest => ({
            ...prevTest,
            ...settings
        }));
    };

    return (
        <div className="test-constructor">
            <h1>Test Constructor</h1>
            <TestSettings onSettingsChange={(settings) => {
                handleTestSettingsChange({
                    name: settings.name,
                    description: settings.description,
                    deadline: settings.deadline,
                    // Store timeLimit in test object if you need it
                });
            }} 
            onSubmitCreateTest={onSubmitCreateTest}/>
            <QuestionsList 
                questions={test.questions} 
                onSelectQuestion={(question) => console.log('Selected question:', question)} 
            />
            <QuestionForm 
                onAddQuestion={(questionText, answerVariants) => {
                    const newQuestion: Question = {
                        id: Date.now(),
                        text: questionText,
                        answers: answerVariants.map((variant) => ({
                            ...variant,
                            question_id: Date.now()
                        })),
                        test_id: test.id,
                        srudent_answers: [],
                        points: 1
                    };
                    addQuestion(newQuestion);
                }} 
            />
            <button onClick={() => console.log(test)}>Create Test</button>
        </div>
    );
};

export default TestConstructor;