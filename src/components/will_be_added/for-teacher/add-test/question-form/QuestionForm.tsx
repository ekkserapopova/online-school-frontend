import React, { useState } from 'react';
import { AnswerVariant } from '../../../../../modules/test';
import './QuestionForm.css';

interface QuestionFormProps {
    onAddQuestion: (questionText: string, answerVariants: AnswerVariant[]) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ onAddQuestion }) => {
    const [questionText, setQuestionText] = useState('');
    const [answerVariants, setAnswerVariants] = useState<AnswerVariant[]>([{ id: 1, number_id: 1, text: '', question_id: 0, is_right: false }]);

    const handleAddAnswerVariant = () => {
        const newVariant: AnswerVariant = {
            id: answerVariants.length + 1,
            number_id: answerVariants.length + 1,
            text: '',
            question_id: 0,
            is_right: false,
        };
        setAnswerVariants([...answerVariants, newVariant]);
    };

    const handleAnswerChange = (index: number, value: string) => {
        const updatedVariants = [...answerVariants];
        updatedVariants[index].text = value;
        setAnswerVariants(updatedVariants);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddQuestion(questionText, answerVariants);
        setQuestionText('');
        setAnswerVariants([{ id: 1, number_id: 1, text: '', question_id: 0, is_right: false }]);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Question:</label>
                <input
                    type="text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Answer Variants:</label>
                {answerVariants.map((variant, index) => (
                    <div key={variant.id}>
                        <input
                            type="text"
                            value={variant.text}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                            required
                        />
                        <label>
                            <input
                                type="checkbox"
                                checked={variant.is_right}
                                onChange={() => {
                                    const updatedVariants = [...answerVariants];
                                    updatedVariants[index].is_right = !updatedVariants[index].is_right;
                                    setAnswerVariants(updatedVariants);
                                }}
                            />
                            Correct Answer
                        </label>
                    </div>
                ))}
                <button type="button" onClick={handleAddAnswerVariant}>
                    Add Answer Variant
                </button>
            </div>
            <button type="submit">Add Question</button>
        </form>
    );
};

export default QuestionForm;