import React from 'react';
import './ActionButton.css';

interface ActionButtonProps {
  label: string;
  onClick: (e: React.MouseEvent) => void;
  primary?: boolean;
  secondary?: boolean;
  small?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  primary = false,
  secondary = false,
  small = false
}) => {
  const getClassName = () => {
    let className = 'action-button';
    if (primary) className += ' action-button--primary';
    if (secondary) className += ' action-button--secondary';
    if (small) className += ' action-button--small';
    return className;
  };
  
  return (
    <button 
      className={getClassName()}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default ActionButton;