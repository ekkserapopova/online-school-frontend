import React, { useState, useEffect } from 'react';
import './ModuleEditForm.css';

interface ModuleEditFormProps {
  moduleId: number;
  initialName: string;
  initialDescription: string;
  onSubmit: (moduleId: number, updatedData: { name: string; description: string }) => void;
  onCancel: () => void;
}

const ModuleEditForm: React.FC<ModuleEditFormProps> = ({
  moduleId,
  initialName,
  initialDescription,
  onSubmit,
  onCancel
}) => {
  // Инициализируем состояние начальными значениями
  const [name, setName] = useState(initialName || '');
  const [description, setDescription] = useState(initialDescription || '');
  const [error, setError] = useState('');

  // При изменении пропсов обновляем состояние
  useEffect(() => {
    setName(initialName || '');
    setDescription(initialDescription || '');
  }, [initialName, initialDescription]);

  // Отслеживаем и выводим в консоль текущие значения
  useEffect(() => {
    console.log('ModuleEditForm текущие значения:', { name, description });
  }, [name, description]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Отправляем форму с данными:', { 
      moduleId, 
      name: name.trim(), 
      description: description.trim() 
    });
    
    if (!name.trim()) {
      setError('Название не может быть пустым');
      return;
    }
    
    onSubmit(moduleId, { 
      name: name.trim(), 
      description: description.trim() 
    });
  };

  return (
    <div className="module-edit-form">
      <h4 className="module-edit-form__title">Редактирование модуля</h4>
      
      <form onSubmit={handleSubmit} className="module-edit-form__form">
        <div className="module-edit-form__form-group">
          <label htmlFor="module-name" className="module-edit-form__label">Название модуля:</label>
          <input
            id="module-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="module-edit-form__input"
          />
          
          <label htmlFor="module-description" className="module-edit-form__label">Описание:</label>
          <textarea
            id="module-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="module-edit-form__textarea"
            rows={4}
          />
          
          {error && <span className="module-edit-form__error">{error}</span>}
        </div>
        
        <div className="module-edit-form__actions">
          <button 
            type="button"
            onClick={onCancel}
            className="module-edit-form__cancel-button"
          >
            Отмена
          </button>
          <button 
            type="submit"
            className="module-edit-form__submit-button"
            disabled={!name.trim()}
          >
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModuleEditForm;