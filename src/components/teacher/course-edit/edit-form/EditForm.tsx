import React, { useState } from 'react';
import './EditForm.css';

type EditItemType = 'lesson' | 'task' | 'test';

interface EditItemFormProps {
  type: EditItemType;
  item: {
    name: string;
    description?: string;
    start?: string;
    end?: string;
    deadline?: string;
    count_questions?: number;
    time_limit?: number;
  };
  onCancel: () => void;
  onSubmit: (updatedItem: any) => void;
}

const extractDate = (str?: string) => str?.split('T')[0] || '';

const toDatetimeLocal = (str?: string) => {
  if (!str) return '';
  const date = new Date(str);
  // Преобразует в формат YYYY-MM-DDTHH:MM
  return date.toISOString().slice(0, 16);
};

const EditItemForm: React.FC<EditItemFormProps> = ({ type, item, onCancel, onSubmit }) => {
  const [name, setName] = useState(item ? item.name : '');
  const [description, setDescription] = useState(item ? item.description : '');
  const [start, setStart] = useState(toDatetimeLocal(item ? item.start: ''));
  const [end, setEnd] = useState(
    type === 'lesson'
      ? toDatetimeLocal(item ? item.end: '')
      : extractDate(item ? item.deadline || item.end : '')
  );
  const [questionCount, setQuestionCount] = useState( item ? item.count_questions?.toString() : '');
  const [timeLimit, setTimeLimit] = useState(item ? item.time_limit?.toString() : '');
  const [error, setError] = useState('');

  const isLesson = type === 'lesson';
  const isTask = type === 'task';
  const isTest = type === 'test';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!name.trim()) return setError('Название не может быть пустым');
    if (!(description ?? '').trim()) return setError('Описание не может быть пустым');
  
    if (isLesson && (!start || !end)) return setError('Укажите дату и время начала и конца');
    if ((isTask || isTest) && !end) return setError('Дедлайн обязателен');
  
    if (isTest) {
      if (!questionCount || isNaN(Number(questionCount))) return setError('Введите количество вопросов');
      if (!timeLimit || isNaN(Number(timeLimit))) return setError('Введите ограничение по времени');
    }
  
    const updatedItem: any = { name, description };
  
    if (isLesson) {
      const startDate = new Date(start);
      startDate.setHours(startDate.getHours() + 3);
      updatedItem.start = startDate.toISOString();
  
      const endDate = new Date(end);
      endDate.setHours(endDate.getHours() + 3);
      updatedItem.end = endDate.toISOString();
    } else if (isTask || isTest) {
      const deadlineDate = new Date(`${end}T23:59:59`);
      deadlineDate.setHours(deadlineDate.getHours() + 3);
      updatedItem.deadline = deadlineDate.toISOString();
    }
  
    if (isTest) {
      updatedItem.count_questions = Number(questionCount);
      updatedItem.time_limit = Number(timeLimit);
    }
  
    onSubmit(updatedItem);
  };
  

  return (
    <div className={`edit-item edit-item--${type}`}>
      <h4 className="edit-item__title">
        Редактировать {isLesson ? 'урок' : isTask ? 'задание' : 'тест'}
      </h4>

      <form onSubmit={handleSubmit} className="edit-item__form">
        <div className="edit-item__form-group">
          <label className="edit-item__form-label">Название:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="edit-item__form-input"
          />

          <label className="edit-item__form-label">Описание:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="edit-item__form-input"
          />

          {isLesson && (
            <>
              <label className="edit-item__form-label">Начало (дата и время):</label>
              <input
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="edit-item__form-input"
              />

              <label className="edit-item__form-label">Конец (дата и время):</label>
              <input
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="edit-item__form-input"
              />
            </>
          )}

          {(isTask || isTest) && (
            <>
              <label className="edit-item__form-label">Дедлайн:</label>
              <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="edit-item__form-input"
              />
            </>
          )}

          {isTest && (
            <>
              <label className="edit-item__form-label">Количество вопросов:</label>
              <input
                type="number"
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
                className="edit-item__form-input"
              />

              <label className="edit-item__form-label">Ограничение по времени (мин):</label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                className="edit-item__form-input"
              />
            </>
          )}

          {error && <span className="edit-item__error">{error}</span>}
        </div>

        <div className="edit-item__actions">
          <button type="button" onClick={onCancel} className="action-button action-button--cancel">
            Отмена
          </button>
          <button type="submit" className="action-button action-button--primary" disabled={!name.trim()}>
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditItemForm;
