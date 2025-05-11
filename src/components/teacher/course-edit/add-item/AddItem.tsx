import React, { useState } from 'react';
import api from '../../../../modules/login';
import './AddItem.css'; 
import { Lesson } from '../../../../modules/lesson';
import { Task } from '../../../../modules/task';
import { Test } from '../../../../modules/test';

type ItemType = 'lesson' | 'task' | 'test';

interface AddItemProps {
  type: ItemType;
  moduleID: number;
  onCancel: () => void;
  onAddItem: (moduleId: number, item: any) => void;
}

const AddItem: React.FC<AddItemProps> = ({ type, moduleID, onCancel, onAddItem }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [questionCount, setQuestionCount] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [error, setError] = useState('');

  const isLesson = type === 'lesson';
  const isTask = type === 'task';
  const isTest = type === 'test';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return setError('Название не может быть пустым');
    if (!description.trim()) return setError('Описание не может быть пустым');

    if (isLesson && (!start || !end)) return setError('Укажите дату и время начала и конца');
    if ((isTask || isTest) && !end) return setError('Дедлайн обязателен');

    if (isTest) {
      if (!questionCount || isNaN(Number(questionCount))) return setError('Введите количество вопросов');
      if (!timeLimit || isNaN(Number(timeLimit))) return setError('Введите ограничение по времени');
    }

    let payload: Partial<Lesson | Task | Test>;



    if (isLesson) {
        payload = {
          name,
          description,
          start: start,
          end: end
        } satisfies Omit<Lesson, 'id'>;
      } else if (isTask) {
        payload = {
          name,
          description,
          deadline: end ? `${end}T23:59:59Z` : '', // Add time component and UTC timezone indicator
        } satisfies Omit<Task, 'id'>;
      } else {
        payload = {
          name,
          description,
          deadline: end ? `${end}T23:59:59Z` : '', // Add time component and UTC timezone indicator
          count_questions: Number(questionCount),
          time_limit: Number(timeLimit),
        } satisfies Omit<Test, 'id'>;
      }


    try {
      await api.post(`module/${moduleID}/${type}`, payload);
      onAddItem(moduleID, payload);
      setName('');
      setDescription('');
      setStart('');
      setEnd('');
      setQuestionCount('');
      setTimeLimit('');
      setError('');
    } catch {
      setError(`Ошибка при добавлении ${type === 'lesson' ? 'урока' : type === 'task' ? 'задания' : 'теста'}`);
    }
  };

  return (
    <div className={`add-item add-item--${type}`}>
      <h4 className="add-item__title">
        Добавить {isLesson ? 'урок' : isTask ? 'задание' : 'тест'}
      </h4>

      <form onSubmit={handleSubmit} className="add-item__form">
        <div className="add-item__form-group">
          <label className="add-item__form-label">Название:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="add-item__form-input"
          />

          <label className="add-item__form-label">Описание:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="add-item__form-input"
          />

          {isLesson && (
            <>
              <label className="add-item__form-label">Начало (дата и время):</label>
              <input
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="add-item__form-input"
              />

              <label className="add-item__form-label">Конец (дата и время):</label>
              <input
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="add-item__form-input"
              />
            </>
          )}

          {(isTask || isTest) && (
            <>
              <label className="add-item__form-label">Дедлайн:</label>
              <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="add-item__form-input"
              />
            </>
          )}

          {isTest && (
            <>
              <label className="add-item__form-label">Количество вопросов:</label>
              <input
                type="number"
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
                className="add-item__form-input"
              />

              <label className="add-item__form-label">Ограничение по времени (мин):</label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                className="add-item__form-input"
              />
            </>
          )}

          {error && <span className="add-item__error">{error}</span>}
        </div>

        <div className="add-item__actions">
          <button type="button" onClick={onCancel} className="add-item__cancel-button">
            Отмена
          </button>
          <button type="submit" className="add-item__submit-button" disabled={!name.trim()} >
            Добавить
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItem;
