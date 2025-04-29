// src/components/test/tabs/TestTabs.tsx
import React from 'react';
import './TestTabs.css';

// Обновленные интерфейсы для работы с новой структурой данных
interface Question {
  id: number;
  text: string;
  test_id?: number;
  answers?: any[];
  // Можно добавить другие поля, если они будут нужны
}

interface TestTabsProps {
  questions: Question[];
  currentIndex: number;
  answeredQuestions: boolean[];
}

const TestTabs: React.FC<TestTabsProps> = ({
  questions,
  currentIndex,
  answeredQuestions
}) => {
  return (
    <div className="quiz-tabs">
      {questions.map((question, index) => (
        <div
          key={question.id}
          className={`quiz-tab ${index === currentIndex ? 'active' : ''} ${
            answeredQuestions[index] ? 'answered' : ''
          }`}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
};

export default TestTabs;