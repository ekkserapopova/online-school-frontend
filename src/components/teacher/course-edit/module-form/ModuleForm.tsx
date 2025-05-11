import React, { useState } from 'react';
import './ModuleForm.css'

interface ModuleFormProps {
  onAddModule: (moduleData: { name: string; description: string }) => void;
}

const ModuleForm: React.FC<ModuleFormProps> = ({ onAddModule }) => {
  const [moduleData, setModuleData] = useState({
    name: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setModuleData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!moduleData.name.trim()) return;
    onAddModule(moduleData);
    setModuleData({ name: '', description: '' });
  };

  return (
    <div className="course-modules__add">
      <h3 className="course-modules__add-title">Добавить новый модуль</h3>
      
      <div className="course-modules__form">
        <div className="course-modules__form-group">
          <label htmlFor="name" className="course-modules__form-label">Название модуля:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={moduleData.name}
            onChange={handleChange}
            className="course-modules__form-input"
            placeholder="Введите название модуля"
          />
        </div>
        
        <div className="course-modules__form-group">
          <label htmlFor="description" className="course-modules__form-label">Описание:</label>
          <textarea
            id="description"
            name="description"
            value={moduleData.description}
            onChange={handleChange}
            className="course-modules__form-textarea"
            placeholder="Введите описание модуля"
            rows={3}
          />
        </div>
        
        <button 
          onClick={handleSubmit}
          className="course-modules__add-button"
          disabled={!moduleData.name.trim()}
        >
          Добавить модуль
        </button>
      </div>
    </div>
  );
};

export default ModuleForm;