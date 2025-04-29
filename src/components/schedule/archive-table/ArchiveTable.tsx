import React, { useState, useMemo } from 'react';
import './ArchiveTable.css';
import { Lesson, LessonWithCourse } from '../../../modules/lesson';
import FinishedLessonCard from '../../finished-lesson-card/FinishedLesson';

// SVG иконки в виде встроенных компонентов
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const SortIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

const ArrowUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"></line>
    <polyline points="5 12 12 5 19 12"></polyline>
  </svg>
);

const ArrowDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <polyline points="19 12 12 19 5 12"></polyline>
  </svg>
);

interface ArchiveTableProps {
  lessons: LessonWithCourse[];
}

type SortField = 'date' | 'course' | null;
type SortDirection = 'asc' | 'desc';

const ArchiveTable: React.FC<ArchiveTableProps> = ({ lessons }) => {
  // Состояния для поиска и сортировки
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Обработчик изменения поля поиска
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Обработчик клика по заголовку для сортировки
  const handleSortClick = (field: SortField) => {
    if (sortField === field) {
      // Если уже сортируем по этому полю, меняем направление
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Если сортируем по новому полю, устанавливаем его и направление по умолчанию
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Функция для получения иконки сортировки
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <SortIcon />;
    return sortDirection === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />;
  };

  // Отфильтрованные и отсортированные уроки с использованием useMemo для оптимизации
  const filteredAndSortedLessons = useMemo(() => {
    // Фильтрация по поисковому запросу
    let result = [...lessons];
    
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.course_name.toLowerCase().includes(lowerSearchTerm) ||
        item.lesson.name.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Сортировка по выбранному полю и направлению
    if (sortField === 'date') {
      result.sort((a, b) => {
        const dateA = new Date(a.lesson.start || '').getTime();
        const dateB = new Date(b.lesson.start || '').getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      });
    } else if (sortField === 'course') {
      result.sort((a, b) => {
        const courseA = a.course_name.toLowerCase();
        const courseB = b.course_name.toLowerCase();
        return sortDirection === 'asc' 
          ? courseA.localeCompare(courseB) 
          : courseB.localeCompare(courseA);
      });
    }
    
    return result;
  }, [lessons, searchTerm, sortField, sortDirection]);

  return (
    <div className="archive-table-container">
      <div className="archive-table-controls">
        <div className="archive-table-search">
          <span className="archive-table-search__icon">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Поиск по курсу или уроку..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="archive-table-search__input"
          />
          {searchTerm && (
            <button 
              className="archive-table-search__clear" 
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
        </div>
        <div className="archive-table-filter">
          <span className="archive-table-filter__label">
            Найдено: {filteredAndSortedLessons.length}
          </span>
        </div>
      </div>
      
      <table className="archive-table">
        <thead className="archive-table__header">
          <tr>
            <th className="archive-table__header-cell">УРОК</th>
            <th 
              className="archive-table__header-cell archive-table__header-cell--sortable"
              onClick={() => handleSortClick('course')}
            >
              КУРС
              <span className="archive-table__sort-icon">
                {getSortIcon('course')}
              </span>
            </th>
            <th 
              className="archive-table__header-cell archive-table__header-cell--sortable"
              onClick={() => handleSortClick('date')}
            >
              ДАТА
              <span className="archive-table__sort-icon">
                {getSortIcon('date')}
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="archive-table__body">
          {filteredAndSortedLessons.length > 0 ? (
            filteredAndSortedLessons.map((lesson) => (
              <FinishedLessonCard key={lesson.lesson.id} lesson={lesson} />
            ))
          ) : (
            <tr className="archive-table__empty">
              <td colSpan={4}>
                {searchTerm ? 'По вашему запросу ничего не найдено' : 'В архиве нет уроков'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ArchiveTable;