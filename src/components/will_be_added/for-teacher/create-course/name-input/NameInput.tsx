import React from 'react';
import './NameInput.css';

interface NameInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  textarea?: boolean;
}

const NameInput: React.FC<NameInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  textarea = false
}) => {
  return (
    <div className="name-input">
      <label>{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default NameInput;