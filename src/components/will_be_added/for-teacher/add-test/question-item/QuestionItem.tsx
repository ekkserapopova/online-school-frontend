import React from 'react';
import { Question } from '../../../../../modules/test';
import './QuestionsList.css';

interface QuestionItemProps {
    question: Question;
    onSelect: (questionId: number) => void;
    isSelected: boolean;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ question, onSelect, isSelected }) => {
    const handleSelect = () => {
        onSelect(question.id);
    };

    return (
        <div className={`question-item ${isSelected ? 'selected' : ''}`} onClick={handleSelect}>
            <p>{question.text}</p>
        </div>
    );
};

export default QuestionItem;