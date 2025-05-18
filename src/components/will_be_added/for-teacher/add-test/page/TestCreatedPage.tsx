import React, { useEffect, useState } from 'react';
import TestSettings from '../test-settings/TestSettings';
import './/TestConstructorPage.css';
import api from '../../../../../modules/login';
import { Question, Test } from '../../../../../modules/test';
import QuestionsList from '../question-list/QuestionsList';
import QuestionForm from '../question-form/QuestionForm';
import { convertDateFormat } from '../../../../../pages/signup-page/SignUpPage';
import axios from 'axios';

const TestCreatedPage: React.FC = () => {
    const [isCreated, setIsCreated] = useState(false);
    const [test, setTest] = useState<Test | null>(null);
    const [statusMessage, setStatusMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isTestGenerated, setIsTestGenerated] = useState(false);

    const testID = Number(window.location.pathname.split('/').pop());

    const getTest = async () => {
        try {
            setStatusMessage(null);
            setLoading(true);

            const authToken = localStorage.getItem('auth_token');
            const response = await axios.get(
                `http://localhost:8080/api/courses/1/test/${testID}`,
                {
                    headers: {
                        Authorization: authToken ? `Bearer ${authToken}` : ''
                    }
                }
            );
            const testData = response.data.test;

            if (testData) {
                setTest(testData);
                setIsCreated(true);

                if (!isTestGenerated) {
                    await generateTest(testData.id);
                    setIsTestGenerated(true);
                }

                setStatusMessage({
                    text: 'Тест успешно загружен! Теперь вы можете добавить вопросы.',
                    type: 'success'
                });
                setLoading(false);
            } else {
                throw new Error('Тест не найден');
            }
        } catch (error) {
            setStatusMessage({
                text: 'Не удалось загрузить тест. Возможно, он ещё создается или произошла ошибка.',
                type: 'error'
            });
            setLoading(false);
        }
    };

    const getQuestions = async () => {
        try {
            setStatusMessage(null);

            const authToken = localStorage.getItem('auth_token');
            const response = await axios.get(
                `http://localhost:8080/api/tests/${testID}/questions`,
                {
                    headers: {
                        Authorization: authToken ? `Bearer ${authToken}` : ''
                    }
                }
            );
            const questions = response.data.questions;

            if (questions) {
                setQuestions(questions);
                setStatusMessage({
                    text: 'Вопросы успешно загружены!',
                    type: 'success'
                });
            } else {
                throw new Error('Вопросы не найдены');
            }
        } catch (error) {
            setStatusMessage({
                text: 'Не удалось загрузить вопросы. Возможно, они ещё создаются или произошла ошибка.',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    }

    const generateTest = async(testId: number) => {
        try {
            if (!questions){
                const authToken = localStorage.getItem('auth_token');
                await axios.post(
                    `http://localhost:8080/api/tests/${testId}`,
                    {},
                    {
                        headers: {
                            Authorization: authToken ? `Bearer ${authToken}` : ''
                        }
                    }
                );
            }
            
        } catch (error) {
            setStatusMessage({
                text: 'Failed to generate test. Please try again.',
                type: 'error'
            });
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            getTest();
        }, 1000); // задержка 1 секунда

        return () => clearTimeout(timer);
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (isCreated) {
            getQuestions();
        }
        // eslint-disable-next-line
    }, [isCreated]);

    return (
        <div className="test-constructor-page">
            <h1>Конструктор теста</h1>
            
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
            
            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Загрузка данных теста...</p>
                </div>
            ) : (
                <>
                    <TestSettings
                        name={test && test.name ? test.name : ''}
                        description={test && test.description ? test.description : ''}
                        timeLimit={test && test.time_limit ? test.time_limit : 0}
                        countQuestions={test && test.count_questions ? test.count_questions : 0}
                        deadline={test && test.deadline ? test.deadline : ''}
                        isCreated={isCreated}            
                    />

                    {isCreated && test && (
                        <>
                            <QuestionsList 
                                questions={questions}
                                onSelectQuestion={(question) => console.log('Selected question:', question)} 
                            />
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default TestCreatedPage;
