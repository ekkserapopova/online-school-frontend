import React, { use, useEffect, useState } from 'react';
import './CreatingModule.css';
import {Module as ModuleType } from '../../../modules/module';
import { OneCourse } from '../../../modules/courses';
import { Lesson } from '../../../modules/lesson';
import CourseHeader from '../../../components/teacher/course-edit/course-header/CourseHeader';
import CourseModules from '../../../components/teacher/course-edit/course-modules/CourseModules';
import ImageUploadModal from '../../../components/teacher/course-edit/course-image/ImageUploadModal';
import { Task } from '../../../modules/task';
import { Test } from '../../../modules/test';
import api from '../../../modules/login';

const CreatingModule: React.FC = () => {
  const [course, setCourse] = useState<OneCourse>({} as OneCourse);

  const courseID = Number(window.location.pathname.split('/').pop());

  const getCourse = async (courseID: number) => {
    try {
      const response = await api.get(`/courses/${courseID}/teacher`);
      const courseData = response.data.course;
      setCourse(courseData);
    } catch (error) {
      console.error('Ошибка получения курса:', error);
    }
  };

  // console.log('Получение курса по ID вне:', courseID);

useEffect(() => {
  getCourse(courseID);
  getPhoto()
  console.log('Получение курса по ID:');
}, []);

  // Состояния UI
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [addingLessonToModuleId, setAddingLessonToModuleId] = useState<number | null>(null);
  const [addingTaskToModuleId, setAddingTaskToModuleId] = useState<number | null>(null);
  const [addingTestToModuleId, setAddingTestToModuleId] = useState<number | null>(null);
  const [openModules, setOpenModules] = useState<Record<number, boolean>>({});
  const [showAddModuleForm, setShowAddModuleForm] = useState<boolean>(false);

  const [photoURL, setPhotoURL] = useState<string | null>(null)

  const getPhoto = async () => {
    try {
        const response = await api.get(`courses/${courseID}/image`, { responseType: "blob" });
        const url = URL.createObjectURL(response.data);
        setPhotoURL(url);
    } catch (error) {
        console.error('Ошибка получения фото пользователя:', error);
        return null;
    }
}


  // Обработчики для работы с модулями
  const toggleModule = (moduleId: number) => {
    setOpenModules({
      ...openModules,
      [moduleId]: !openModules[moduleId]
    });
  };

  const handleAddModule = (moduleData: { name: string; description: string }) => {
    if (!moduleData.name.trim()) return;

    const newModuleObject: ModuleType = {
      id: Math.max(0, ...course.modules.map(m => m.id)) + 1,
      name: moduleData.name,
      description: moduleData.description,
      tasks: [],
      progress: 0
    };

    setCourse(prev => ({
      ...prev,
      modules: [...prev.modules, newModuleObject]
    }));
    
    setShowAddModuleForm(false);
  };

  // Обработчики для работы с уроками
  const handleAddItem = (
    moduleId: number,
    itemData: Omit<Lesson, 'id'> | Omit<Task, 'id'> | Omit<Test, 'id'>,
    type: 'lesson' | 'task' | 'test'
  ) => {
    const moduleIndex = course.modules.findIndex((m) => m.id === moduleId);
    if (moduleIndex === -1) return;
  
    setCourse((prev) => {
      const updatedModules = [...prev.modules];
      const module = updatedModules[moduleIndex];
  
      // Получаем текущий список элементов в зависимости от типа
      const currentList = (() => {
        if (type === 'lesson') return module.lessons || [];
        if (type === 'task') return module.tasks || [];
        if (type === 'test') return module.tests || [];
        return [];
      })();
  
      // Генерируем новый ID
      const newId =
        currentList.length > 0 ? Math.max(...currentList.map((item) => item.id)) + 1 : 1;
  
      const newItem = { id: newId, ...itemData };
  
      // Обновляем соответствующий список
      let updatedModule = { ...module };

      if (type === 'lesson') {
        updatedModule = {
          ...module,
          lessons: [...(module.lessons || []), newItem as Lesson],
        };
      } else if (type === 'task') {
        updatedModule = {
          ...module,
          tasks: [...(module.tasks || []), newItem as Task],
        };
      } else if (type === 'test') {
        updatedModule = {
          ...module,
          tests: [...(module.tests || []), newItem as Test],
        };
      }

      updatedModules[moduleIndex] = updatedModule;
  
      return {
        ...prev,
        modules: updatedModules,
      };
    });
  
    // Сброс состояния добавления (по типу)
    if (type === 'lesson') setAddingLessonToModuleId(null);
    else if (type === 'task') setAddingTaskToModuleId(null);
    else if (type === 'test') setAddingTestToModuleId(null);
  };
  

  // Обработчики для работы с изображениями
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = () => {
    if (imagePreview) {
      setCourse(prev => ({
        ...prev,
        image: imagePreview
      }));
      setShowImageModal(false);
      setImagePreview(null);
    }
  };

  return (
    <div className="course-page">
      {/* Верхняя часть - информация о курсе */}
      <CourseHeader 
        course={course} 
        onImageClick={() => setShowImageModal(true)} 
      />

      {/* Модули курса */}
      <CourseModules 
        modules={course.modules}
        openModules={openModules}
        toggleModule={toggleModule}
        showAddModuleForm={showAddModuleForm}
        setShowAddModuleForm={setShowAddModuleForm}
        addingLessonToModuleId={addingLessonToModuleId}
        addingTaskToModuleId={addingTaskToModuleId}
        addingTestToModuleId={addingTestToModuleId}

        onAddLessonClick={(id) => setAddingLessonToModuleId(id)}
        onCancelAddLesson={() => setAddingLessonToModuleId(null)}
        onAddLesson={(moduleId, lessonData) => handleAddItem(moduleId, lessonData, 'lesson')}

        onAddTaskClick={(id) => setAddingTaskToModuleId(id)}
        onCancelAddTask={() => setAddingTaskToModuleId(null)}
        onAddTask={(moduleId, taskData) => handleAddItem(moduleId, taskData, 'task')}

        onAddTestClick={(id) => setAddingTestToModuleId(id)}
        onCancelAddTest={() => setAddingTestToModuleId(null)}
        onAddTest={(moduleId, testData) => handleAddItem(moduleId, testData, 'test')}

        onAddModule={handleAddModule}
      />


      {/* Модальное окно для загрузки изображения */}
      <ImageUploadModal 
        isOpen={showImageModal}
        currentImage={photoURL ?? undefined}
        imagePreview={imagePreview}
        onClose={() => {
          setShowImageModal(false);
          setImagePreview(null);
        }}
        onFileChange={handleImageChange}
        onSave={handleSaveImage}
      />
    </div>
  );

};

export default CreatingModule;