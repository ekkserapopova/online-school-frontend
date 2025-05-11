import React, { useEffect, useState } from 'react';
import TestSettings from '../test-settings/TestSettings';
import './/TestConstructorPage.css';
import api from '../../../../../modules/login';
import { Test } from '../../../../../modules/test';
import QuestionsList from '../question-list/QuestionsList';
import { convertDateFormat } from '../../../../../pages/signup-page/SignUpPage';
import { useNavigate } from 'react-router-dom';
import { response } from 'express';

const TestConstructorPage: React.FC = () => {
    const [testName, setTestName] = useState('');
    const [testDescription, setTestDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [timeLimit, setTimeLimit] = useState(0);
    const [countQuestions, setCountQuestions] = useState(0);
    const [isCreated, setIsCreated] = useState(false);
    const [test, setTest] = useState<Test | null>(null);
    const [statusMessage, setStatusMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
    const navigate = useNavigate();
    
    const pathParts = window.location.pathname.split('/');
    const moduleIndex = pathParts.findIndex(part => part === 'module');
    const moduleID = moduleIndex !== -1 && pathParts.length > moduleIndex + 1
        ? Number(pathParts[moduleIndex + 1])
        : NaN;

    const createTest = async () => {
        try {
            setStatusMessage(null);
            console.log(moduleID)
            const response = await api.post(`/module/${moduleID}/createtest`, {
                name: testName,
                description: testDescription,
                deadline: convertDateFormat(deadline),
                time_limit: timeLimit,
                count_questions: countQuestions,
                module_id: moduleID
            });

            const testData = response.data.test;
            setTest(testData);

            setIsCreated(true);
            setStatusMessage({
                text: 'Test created successfully! You can now add questions.',
                type: 'success'
            });
            console.log('Test created successfully:', response.data.test);
            console.log(`/module/${moduleID}/createdtest/${testData.id}`)
            navigate(`/module/${moduleID}/createdtest/${testData.id}`);
        } catch (error) {
            console.error('Error creating test:', error);
            setStatusMessage({
                text: 'Failed to create test. Please try again.',
                type: 'error'
            });
        }
    };

   

    return (
        <div className="test-constructor-page">
            <h1>Test Constructor</h1>
            
            {statusMessage && (
                <div className={`status-message ${statusMessage.type}`}>
                    {statusMessage.text}
                    <button 
                        className="close-button" 
                        onClick={() => setStatusMessage(null)}
                    >
                        ×
                    </button>
                </div>
            )}
            
            <TestSettings
                onSubmitCreateTest={createTest}
                name={testName}
                description={testDescription}
                timeLimit={timeLimit}
                countQuestions={countQuestions}
                deadline={deadline}
                setCountQuestions={setCountQuestions}
                setDeadline={setDeadline}
                setDescription={setTestDescription}
                setTimeLimit={setTimeLimit}
                setName={setTestName}
                isCreated={isCreated}            
            />

            {isCreated && (
                <>
                <QuestionsList 
                    questions={test && test.questions ? test.questions : []} 
                    onSelectQuestion={(question) => console.log('Selected question:', question)} 
                />
                {/* <QuestionForm 
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
                /> */}
                </>
            )}
        </div>
    );
};

export default TestConstructorPage;