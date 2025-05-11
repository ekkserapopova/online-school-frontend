import React from 'react';
import { Question } from '../../../../../modules/test';
import './QuestionsList.css';

interface QuestionsListProps {
  questions: Question[];
  onSelectQuestion: (question: Question) => void;
}

const QuestionsList: React.FC<QuestionsListProps> = ({ questions, onSelectQuestion }) => {
  return (
    <div className="questions-list">
      <h2>Вопросы</h2>
      <ul>
        {questions.map((question) => (
          <li key={question.id} onClick={() => onSelectQuestion(question)}>
            {question.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionsList;