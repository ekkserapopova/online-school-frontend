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
          <div className="image-modal__preview">
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Предпросмотр" 
                className="image-modal__preview-img" 
              />
            ) : (
              <img 
                src={currentImage} 
                alt="Текущее изображение" 
                className="image-modal__current-img" 
              />
            )}
          </div>
          
          <div className="image-modal__upload">
            <input
              type="file"
              id="courseImage"
              accept="image/*"
              onChange={onFileChange}
              className="image-modal__file-input"
            />
            <label htmlFor="courseImage" className="image-modal__file-label">
              Выбрать файл
            </label>
            <p className="image-modal__hint">
              Рекомендуемый размер: 800x400 пикселей
            </p>
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