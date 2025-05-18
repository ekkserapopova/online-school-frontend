// src/components/QuizQuestion.tsx
import React from 'react';
import './TestQuestion.css';

interface Question {
  id: number;
  text: string;
  options: string[];
  answerIds: number[]; // Идентификаторы для каждого варианта ответа
}

interface QuizQuestionProps {
  question: Question;
  selectedAnswerIds: number[]; // Теперь храним ID выбранных ответов
  onSelectAnswer: (answerId: number) => void; // Передаем ID ответа
  onRecordAnswer: () => void;
  isLastQuestion: boolean;
}

const TestQuestion: React.FC<QuizQuestionProps> = ({
  question,
  selectedAnswerIds,
  onSelectAnswer,
  onRecordAnswer,
  isLastQuestion
}) => {
  return (
    <div className="quiz-question">
      <h2 className="question-text">{question.text}</h2>
      <div className="question-options">
        {question.options.map((option, index) => (
          <div
            key={index}
            className={`question-option ${selectedAnswerIds.includes(question.answerIds[index]) ? 'selected' : ''}`}
            onClick={() => onSelectAnswer(question.answerIds[index])}
          >
            {option}
          </div>
        ))}
      </div>
      {!isLastQuestion && (
      <button
        className="record-button"
        onClick={onRecordAnswer}
        disabled={selectedAnswerIds.length === 0} // Кнопка активна, если выбран хотя бы один ответ
      >
        { 'Записать ответ'}
      </button>
      )}
    </div>
  );
};

export default TestQuestion;