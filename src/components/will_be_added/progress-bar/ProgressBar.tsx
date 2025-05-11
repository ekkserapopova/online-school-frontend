import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  progress: number;
  status: 'low' | 'medium' | 'high' | 'complete';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, status }) => {
  // Нормализуем прогресс
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={`progress-bar-container status-${status}`}>
      <div 
        className="progress-bar-fill"
        style={{ width: `${normalizedProgress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;