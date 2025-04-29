// src/components/ProgressBar.tsx
import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  total: number;
  completed: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ total, completed }) => {
  const progressPercentage = (completed / total) * 100;
  
  return (
    <div className="progress-container">
      <div className="progress-text">
        Отвечено на {completed} из {total} вопросов
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;