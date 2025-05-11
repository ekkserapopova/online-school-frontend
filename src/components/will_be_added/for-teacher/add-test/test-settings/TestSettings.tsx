import React, { useState } from 'react';
import './TestSettings.css';

interface TestSettingsProps {
    onSubmitCreateTest?: () => void;
    isCreated: boolean;
    name: string;
    description: string;
    deadline: string;
    timeLimit: number;
    countQuestions: number;
    setName?: (name: string) => void;
    setDescription?: (description: string) => void;
    setDeadline?: (deadline: string) => void;
    setTimeLimit?: (timeLimit: number) => void;
    setCountQuestions?: (countQuestions: number) => void;
}

const TestSettings: React.FC<TestSettingsProps> = ({isCreated, onSubmitCreateTest, name, description, deadline, countQuestions, timeLimit, setCountQuestions, setDeadline, setDescription, setName, setTimeLimit }) => {

    return (
        <div className="test-settings">
            <h2>Создание теста</h2>
            <form >
                <div>
                    <label htmlFor="name">Название*:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName?.(e.target.value)}
                        required
                    />:
                </div>
                <div>
                    <label htmlFor="description">Описание:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription?.(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="deadline">Дедлайн*:</label>
                    <input
                        type="date"
                        id="deadline"
                        value={deadline}
                        onChange={(e) => setDeadline?.(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="timeLimit">Ограничение по времени(в минутах)*:</label>
                    <input
                        type="number"
                        id="timeLimit"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit?.(Number(e.target.value))}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="countQuestions">Количество вопросов*:</label>
                    <input
                        type="number"
                        id="countQuestions"
                        value={countQuestions}
                        onChange={(e) => setCountQuestions?.(Number(e.target.value))}
                        required
                    />
                </div>
                {!isCreated && 
                    <button onClick={onSubmitCreateTest} type="submit">Save Settings</button>
            }
            </form>
        </div>
    );
};

export default TestSettings;