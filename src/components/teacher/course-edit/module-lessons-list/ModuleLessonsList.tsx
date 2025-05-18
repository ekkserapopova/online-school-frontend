import React, { useState } from 'react';
import { Lesson } from '../../../../modules/lesson';
import { Material } from '../../../../modules/material';
import EditForm from '../edit-form/EditForm';
import ModuleMaterialsList from '../module-materials-list/ModuleMaterialsList';
import axios from 'axios';
import './ModuleLessonsList.css';
import { FiTrash } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface ModuleLessonsListProps {
  lessons: Lesson[] | undefined;
  onUpdateLesson: (lessonId: string, updatedLesson: Partial<Lesson>) => void;
  onDeleteLesson: (lessonId: string) => void;
}

const ModuleLessonsList: React.FC<ModuleLessonsListProps> = ({ 
  lessons, 
  onUpdateLesson, 
  onDeleteLesson 
}) => {
  const [hiddenLessons, setHiddenLessons] = useState<{ [key: string]: boolean }>({});
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [expandedLessons, setExpandedLessons] = useState<{ [key: string]: boolean }>({});

  const toggleLessonVisibility = (lessonId: string, isActive: boolean) => {
    setHiddenLessons(prevState => ({
      ...prevState,
      [lessonId]: !isActive, 
    }));
  
    onUpdateLesson(lessonId, { is_active: isActive });
    updateLessonVisibility(lessonId, isActive);
  };

  const toggleLessonExpand = (lessonId: number) => {
    setExpandedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

  const handleEditClick = (lesson: Lesson) => {
    setEditingLesson(lesson);
  };

  const updateLessonVisibility = async (lessonId: string, isActive: boolean) => {
    try {
      const authToken = localStorage.getItem('auth_token');
      await axios.patch(
        `http://localhost:8080/api/lessons/${lessonId}`,
        { is_active: isActive },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
    } catch(error) {
      console.error('Ошибка обновления видимости урока:', error);
    }
  }

  const handleEditSubmit = (updatedLesson: Partial<Lesson>) => {
    if (editingLesson) {
      onUpdateLesson(String(editingLesson.id), updatedLesson);
      setEditingLesson(null);
    }
  };

  const handleDeleteClick = (lessonId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот урок?')) {
      onDeleteLesson(lessonId);
    }
  };

  // Функции для работы с материалами
  const handleUpdateMaterial = (lessonId: number, materialId: number, updatedData: Partial<Material>) => {
    const lesson = lessons?.find(l => l.id === lessonId);
    if (!lesson || !lesson.materials) return;

    // Создаем обновленный массив материалов
    const updatedMaterials = lesson.materials.map(material => 
      material.id === materialId ? { ...material, ...updatedData } : material
    );

    // Передаем обновленный массив материалов
    onUpdateLesson(String(lessonId), { materials: updatedMaterials });
  };

  const handleDeleteMaterial = (lessonId: number, materialId: number) => {
    try{
      const lesson = lessons?.find(l => l.id === lessonId);
      if (!lesson || !lesson.materials) return;

      // Фильтруем массив материалов, исключая удаляемый
      const updatedMaterials = lesson.materials.filter(material => material.id !== materialId);
      
      // Передаем обновленный массив материалов
      onUpdateLesson(String(lessonId), { materials: updatedMaterials });
      console.log('Материал успешно удален:', materialId);
    } catch (error) {
      console.error('Ошибка при удалении материала:', error);
      toast.error('Не удалось удалить материал');
    }
    
    
  };

  // Обновите функцию handleAddMaterial

  const handleAddMaterial = async (lessonId: number, material: Material) => {
    try {
      // Создаем FormData только если есть файл
      if (!material.file) {
        console.error('Файл отсутствует');
        return;
      }
      
      const formData = new FormData();
      formData.append('file', material.file);
      formData.append('name', material.name);
      formData.append('description', material.description || '');
      
      const authToken = localStorage.getItem('auth_token');
      const response = await axios.post(
        `http://localhost:8080/api/lessons/${lessonId}/materials`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      
      // Проверяем, что ответ корректный
      if (!response.data || !response.data.material) {
        throw new Error('Неверный формат ответа от API');
      }
      
      const materialData = response.data.material;
      console.log('Материал успешно добавлен:', materialData);

      // Обновляем список материалов в уроке
      const lesson = lessons?.find(l => l.id === lessonId);
      if (!lesson) return;

      const updatedMaterials = [...(lesson.materials || []), materialData];
      onUpdateLesson(String(lessonId), { materials: updatedMaterials });
      
      // Показываем уведомление пользователю
      toast.success('Материал успешно добавлен!');
      
    } catch (error) {
      console.error('Ошибка при добавлении материала:', error);
      toast.error('Не удалось добавить материал');
    }
  };
  if (!lessons || lessons.length === 0) return null;

  return (
    <div className="module__section">
      <h4 className="module__section-title">Уроки</h4>
      <ul className="module__list">
        {lessons.map(lesson => {
          const isHidden = !lesson.is_active;
          const isExpanded = expandedLessons[lesson.id] || false;
          
          return (
            <React.Fragment key={lesson.id}>
              <li
                className={`module__list-item module__list-item--lesson ${
                  isHidden ? 'module__list-item--hidden' : ''
                }`}
              >
                <div className="module__list-item-content">
                  <div 
                    className="module__lesson-info"
                    onClick={() => toggleLessonExpand(lesson.id)}
                  >
                    <span className="module__lesson-name">
                      {lesson.name}
                      <span className={`module__expand-icon ${isExpanded ? 'module__expand-icon--open' : ''}`}>
                        {isExpanded ? '▼' : '►'}
                      </span>
                    </span>
                  </div>
                  <div className="module__buttons">
                    <button
                      className="module__edit-button"
                      onClick={() => handleEditClick(lesson)}
                    >
                      Редактировать
                    </button>
                    <button
                      className="module__toggle-button"
                      onClick={() => toggleLessonVisibility(String(lesson.id), isHidden)}
                    >
                      {isHidden ? 'Показать' : 'Скрыть'}
                    </button>
                    <button
                      className="module__delete-button"
                      onClick={() => handleDeleteClick(String(lesson.id))}
                    >
                      <FiTrash size={18} color='red'/>
                    </button>
                  </div>
                </div>
              </li>
              
              {isExpanded && (
                <li className="module__list-item module__list-item--materials">
                  <ModuleMaterialsList
                    materials={lesson.materials}
                    lessonId={lesson.id}
                    onUpdateMaterial={(materialId, data) => handleUpdateMaterial(lesson.id, materialId, data)}
                    onDeleteMaterial={(materialId) => handleDeleteMaterial(lesson.id, materialId)}
                    onAddMaterial={(lessonId, material) => handleAddMaterial(lessonId, material)} // Передаем lessonId
                  />
                </li>
              )}
              
              {editingLesson?.id === lesson.id && (
                <li className="module__list-item module__list-item--edit-form">
                  <EditForm
                    type='lesson'
                    item={editingLesson}
                    onCancel={() => setEditingLesson(null)}
                    onSubmit={handleEditSubmit}
                  />
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
};

export default ModuleLessonsList;