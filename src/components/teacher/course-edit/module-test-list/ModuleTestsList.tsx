import React, { useState, useEffect } from 'react';
import { Test } from '../../../../modules/test';
import EditForm from '../edit-form/EditForm';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ModuleTestsList.css';
import TestQuestions from '../test-questions/TestQuestions';
import { FiTrash } from 'react-icons/fi';

interface ModuleTestsListProps {
  tests: Test[] | undefined;
  onUpdateTest: (testId: string, updatedTest: Partial<Test>, type: string) => void;
  onDeleteTest: (testId: string) => void;
}

const ModuleTestsList: React.FC<ModuleTestsListProps> = ({ tests, onUpdateTest, onDeleteTest }) => {
  const [hiddenTests, setHiddenTests] = useState<{ [key: string]: boolean }>({});
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [expandedTests, setExpandedTests] = useState<{ [key: string]: boolean }>({});
  const [generatingTests, setGeneratingTests] = useState<{ [key: string]: boolean }>({});
  const [testsWithQuestions, setTestsWithQuestions] = useState<{ [key: string]: boolean }>({});

  // Проверка наличия вопросов при монтировании и изменении тестов
  useEffect(() => {
    if (tests && tests.length > 0) {
      tests.forEach(test => {
        checkTestQuestions(String(test.id));
      });
    }
  }, [tests]);

  // Функция для проверки наличия вопросов у теста
  const checkTestQuestions = async (testId: string) => {
    try {
      const authToken = localStorage.getItem('auth_token');
      const response = await axios.get(
        `http://localhost:8080/api/tests/${testId}/questions`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );
      
      // Проверяем, есть ли вопросы у теста
      const hasQuestions = 
        response.data && 
        response.data.questions && 
        response.data.questions.length > 0;
      
      setTestsWithQuestions(prev => ({
        ...prev,
        [testId]: hasQuestions
      }));
      
    } catch (error) {
      console.error('Ошибка при проверке вопросов теста:', error);
      // В случае ошибки предполагаем, что вопросов нет
      setTestsWithQuestions(prev => ({
        ...prev,
        [testId]: false
      }));
    }
  };

  // Функция для переключения отображения вопросов теста
  const toggleTestQuestions = (testId: string) => {
    setExpandedTests(prev => ({
      ...prev,
      [testId]: !prev[testId]
    }));
  };

  const toggleTestVisibility = (testId: string, isActive: boolean) => {
    setHiddenTests(prevState => ({
      ...prevState,
      [testId]: !isActive, 
    }));
  
    onUpdateTest(testId, { is_active: isActive }, 'tests');
    updateTaskVisibility(testId, isActive);
  };

  const handleEditClick = (task: Test) => {
    setEditingTest(task);
  };

  const updateTaskVisibility = async (testId: string, isActive: boolean) => {
    try {
      const authToken = localStorage.getItem('auth_token');
      await axios.patch(
        `http://localhost:8080/api/tests/${testId}`,
        { is_active: isActive },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
    } catch(error) {
      console.error('Ошибка обновления видимости теста:', error);
    }
  }

  const handleEditSubmit = (updatedTask: Partial<Test>) => {
    if (editingTest) {
      onUpdateTest(String(editingTest.id), updatedTask, 'tests');
      setEditingTest(null);
    }
  };

  const handleDeleteClick = (taskId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот тест?')) {
      onDeleteTest(taskId);
    }
  };

  // Функция для генерации вопросов
  const generateQuestions = async (test: Test) => {
    const testId = String(test.id);
    
    // Устанавливаем состояние генерации
    setGeneratingTests(prev => ({ ...prev, [testId]: true }));
    
    try {
      toast.info('Начата генерация вопросов для теста...');
      
      const authToken = localStorage.getItem('auth_token');
      const response = await axios.post(
        `http://localhost:8080/api/tests/${testId}/generate-questions`, {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      
      console.log('Вопросы успешно сгенерированы:', response.data);
      toast.success('Вопросы успешно сгенерированы!');
      
      // Отмечаем, что у теста теперь есть вопросы
      setTestsWithQuestions(prev => ({
        ...prev,
        [testId]: true
      }));
      
      // Автоматически открываем вопросы после генерации
      setExpandedTests(prev => ({ ...prev, [testId]: true }));
      
    } catch (error) {
      console.error('Ошибка при генерации вопросов:', error);
      toast.error('Не удалось сгенерировать вопросы. Попробуйте позже.');
    } finally {
      setGeneratingTests(prev => ({ ...prev, [testId]: false }));
    }
  };

  if (!tests || tests.length === 0) return null;

  return (
    <div className="module__section">
      <h4 className="module__section-title">Тесты</h4>
      <ul className="module__list">
        {tests.map(test => {
          const isHidden = !test.is_active;
          const hasQuestions = testsWithQuestions[String(test.id)];
          const isExpanded = expandedTests[String(test.id)];
          const isGenerating = generatingTests[String(test.id)];
          
          return (
            <React.Fragment key={test.id}>
              <li
                className={`module__list-item module__list-item--test ${
                  isHidden ? 'module__list-item--hidden' : ''
                }`}
              >
                <div className="module__list-item-content">
                  <strong className="module__test-name">{test.name}</strong>
                  <div className="module__buttons">
                    {hasQuestions ? (
                      <button
                        className="module__view-button"
                        onClick={() => toggleTestQuestions(String(test.id))}
                      >
                        {isExpanded ? 'Скрыть вопросы' : 'Показать вопросы'}
                      </button>
                    ) : (
                      <button
                        className="module__generate-button"
                        onClick={() => generateQuestions(test)}
                        disabled={isGenerating}
                      >
                        {isGenerating ? 'Генерация...' : 'Сгенерировать вопросы'}
                      </button>
                    )}
                    <button
                      className="module__edit-button"
                      onClick={() => handleEditClick(test)}
                    >
                      Редактировать
                    </button>
                    <button
                      className="module__toggle-button"
                      onClick={() => toggleTestVisibility(String(test.id), isHidden)}
                    >
                      {isHidden ? 'Показать' : 'Скрыть'}
                    </button>
                    <button
                      className="module__delete-button"
                      onClick={() => handleDeleteClick(String(test.id))}
                    >
                      <FiTrash size={18} color='red'/>
                    </button>
                  </div>
                </div>
              </li>
              
              {/* Отображение вопросов теста */}
              {isExpanded && hasQuestions && (
                <li className="module__list-item module__list-item--questions">
                  <TestQuestions testId={String(test.id)} />
                </li>
              )}
              
              {editingTest?.id === test.id && (
                <li className="module__list-item module__list-item--edit-form">
                  <EditForm
                    type='test'
                    item={editingTest}
                    onCancel={() => setEditingTest(null)}
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

export default ModuleTestsList;