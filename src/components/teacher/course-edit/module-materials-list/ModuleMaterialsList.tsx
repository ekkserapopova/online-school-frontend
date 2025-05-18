import React, { useState } from 'react';
import { Material } from '../../../../modules/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ModuleMaterialsList.css';
import { FiTrash } from 'react-icons/fi';
import '../Buttons.css'

interface ModuleMaterialsListProps {
  materials: Material[] | null | undefined;
  lessonId: number;
  onUpdateMaterial: (materialId: number, updatedData: Partial<Material>) => void;
  onDeleteMaterial: (materialId: number) => void;
  onAddMaterial: (lessonId: number, material: Material) => void;
}

// Интерфейс для формы нового материала
interface NewMaterialForm {
  name: string;
  description: string;
  file: File | null;
}

const ModuleMaterialsList: React.FC<ModuleMaterialsListProps> = ({
  materials,
  lessonId,
  onUpdateMaterial,
  onDeleteMaterial,
  onAddMaterial
}) => {
  const [editingMaterialId, setEditingMaterialId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState<string>('');
  const [editedDescription, setEditedDescription] = useState<string>('');
  const [isAddingMaterial, setIsAddingMaterial] = useState<boolean>(false);
  const [newMaterial, setNewMaterial] = useState<NewMaterialForm>({
    name: '',
    description: '',
    file: null
  });

  const handleEditClick = (material: Material) => {
    setEditingMaterialId(material.id);
    setEditedName(material.name);
    setEditedDescription(material.description || '');
  };

  const handleSaveEdit = async (materialId: number) => {
    if (!editedName.trim()) {
      toast.error('Название материала не может быть пустым');
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      await axios.patch(
        `http://localhost:8080/api/lessons/${lessonId}/materials/${materialId}`,
        { 
          name: editedName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      onUpdateMaterial(materialId, { 
        name: editedName,
        description: editedDescription
      });
      
      setEditingMaterialId(null);
      toast.success('Материал успешно обновлен');
    } catch (error) {
      console.error('Ошибка при обновлении материала:', error);
      toast.error('Не удалось обновить материал');
    }
  };

  const handleDeleteClick = async (materialId: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот материал?')) {
      return;
    }

    try {
      const authToken = localStorage.getItem('auth_token');
      await axios.delete(
        `http://localhost:8080/api/lessons/${lessonId}/materials/${materialId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      onDeleteMaterial(materialId);
      toast.success('Материал успешно удален');
    } catch (error) {
      console.error('Ошибка при удалении материала:', error);
      toast.error('Не удалось удалить материал');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewMaterial({
        ...newMaterial,
        file: e.target.files[0]
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMaterial({
      ...newMaterial,
      [name]: value
    });
  };

  // Исправленная функция добавления материала, которая передает данные напрямую в родительский компонент
  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMaterial.name.trim()) {
      toast.error('Введите название материала');
      return;
    }

    if (!newMaterial.file) {
      toast.error('Выберите файл');
      return;
    }

    try {
      // Создаем объект FormData для отправки файла
      const formData = new FormData();
      formData.append('name', newMaterial.name);
      // formData.append('description', newMaterial.description);
      formData.append('file', newMaterial.file);
      
      // Вызываем функцию onAddMaterial, передавая ей lessonId и все необходимые данные
      // Создаем объект, соответствующий интерфейсу Material с добавлением file
      const materialToAdd = {
        id: 0, // Временный ID, который будет заменен при создании на сервере
        name: newMaterial.name,
        // description: newMaterial.description,
        lesson_id: lessonId,
        file: newMaterial.file // Передаем файл для загрузки
      } as Material; // Расширяем тип Material добавляя поле file типа File
      
      onAddMaterial(lessonId, materialToAdd);
      
      // Сбрасываем форму
      setNewMaterial({
        name: '',
        description: '',
        file: null
      });
      setIsAddingMaterial(false);
      
    } catch (error) {
      console.error('Ошибка при добавлении материала:', error);
      toast.error('Не удалось добавить материал');
    }
  };

  const handleDownload = async (material: Material) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(
        `http://localhost:8080/api/materials/${material.id}/download`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Создаем временную ссылку для скачивания файла
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', material.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка при скачивании материала:', error);
      toast.error('Не удалось скачать материал');
    }
  };

  return (
    <div className="module-materials">
      <h5 className="module-materials__title">Материалы урока</h5>
      
      {(!materials || materials.length === 0) ? (
        <p className="module-materials__empty">Нет материалов для этого урока</p>
      ) : (
        <ul className="module-materials__list">
          {materials.map(material => (
            <li key={material.id} className="module-materials__item">
              {editingMaterialId === material.id ? (
                <div className="module-materials__edit-form">
                  <div className="module-materials__form-group">
                    <label className="module-materials__label">Название:</label>
                    <input
                      type="text"
                      value={editedName}
                      onChange={e => setEditedName(e.target.value)}
                      className="module-materials__edit-input"
                    />
                  </div>
                  <div className="module-materials__form-group">
                    <label className="module-materials__label">Описание:</label>
                    <textarea
                      value={editedDescription}
                      onChange={e => setEditedDescription(e.target.value)}
                      className="module-materials__edit-textarea"
                      rows={3}
                    />
                  </div>
                  <div className="module-materials__edit-actions">
                    <button 
                      onClick={() => handleSaveEdit(material.id)}
                      className="action-button action-button--primary"
                    >
                      Сохранить
                    </button>
                    <button 
                      onClick={() => setEditingMaterialId(null)}
                      className="action-button action-button--cancel"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <div className="module-materials__content">
                  <div className="module-materials__info">
                    <span 
                      className="module-materials__name"
                      onClick={() => handleDownload(material)}
                      title="Скачать материал"
                    >
                      {material.name}
                    </span>
                    {material.description && (
                      <span className="module-materials__description">
                        {material.description}
                      </span>
                    )}
                  </div>
                  <div className="module-materials__actions">
                    <button 
                      onClick={() => handleEditClick(material)}
                      className="module-materials__edit-button"
                    >
                      Редактировать
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(material.id)}
                      className="module-materials__delete-button"
                    >
                      <FiTrash size={18} />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      
      {isAddingMaterial ? (
        <form onSubmit={handleAddMaterial} className="module-materials__add-form">
          <div className="module-materials__form-group">
            <label className="module-materials__label">Название:</label>
            <input
              type="text"
              name="name"
              value={newMaterial.name}
              onChange={handleInputChange}
              className="module-materials__input"
              required
            />
          </div>
          
          
          <div className="module-materials__form-group">
            <label className="module-materials__label">Файл:</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="module-materials__file-input"
              required
            />
          </div>
          
          <div className="module-materials__form-actions">
            <button 
              type="button"
              onClick={() => setIsAddingMaterial(false)}
              className="module-materials__cancel-button"
            >
              Отмена
            </button>
            <button 
              type="submit"
              className="module-materials__submit-button"
            >
              Добавить материал
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAddingMaterial(true)}
          className="module-materials__add-button"
        >
          + Добавить материал
        </button>
      )}
    </div>
  );
};

export default ModuleMaterialsList;