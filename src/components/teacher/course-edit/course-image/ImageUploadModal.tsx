import React from 'react';
import './ImageUploadModal.css'

interface ImageUploadModalProps {
  isOpen: boolean;
  currentImage: string | undefined;
  imagePreview: string | null;
  onClose: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  currentImage,
  imagePreview,
  onClose,
  onFileChange,
  onSave
}) => {
  if (!isOpen) return null;

  // Добавим логирование для отладки
  console.log("ImageUploadModal render:", { currentImage, imagePreview });
  
  // Получение имени файла из imagePreview URL если доступно
  const getFileName = () => {
    if (!imagePreview) return '';
    // Пытаемся извлечь имя файла из data URL
    const match = imagePreview.match(/name=(.*?)(;|$)/);
    return match ? match[1] : 'Выбранное изображение';
  };

  return (
    <div className="image-modal-overlay">
      <div className="image-modal">
        <div className="image-modal__header">
          <h3 className="image-modal__title">Загрузка изображения курса</h3>
          <button 
            className="close-form-button"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="image-modal__content">
          {imagePreview && (
            <div className="image-modal__preview">
              <div className="image-modal__preview-container">
                <img 
                  src={imagePreview} 
                  alt="Предпросмотр" 
                  className="image-modal__preview-image" 
                />
              </div>
              <div className="image-modal__file-info">
                <span className="image-modal__file-selected">✓ Файл выбран</span>
              </div>
            </div>
          )}
          
          <div className="image-modal__upload">
            <input
              type="file"
              id="courseImage"
              accept="image/*"
              onChange={onFileChange}
              className="image-modal__file-input"
            />
            <label htmlFor="courseImage" className="image-modal__file-label">
              {imagePreview ? 'Выбрать другой файл' : 'Выбрать файл'}
            </label>
          </div>
          <div className="image-modal__actions">
            <button 
              className="cancel-button"
              onClick={onClose}
            >
              Отмена
            </button>
            <button 
              className="image-modal__save-button"
              onClick={onSave}
              disabled={!imagePreview}
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;