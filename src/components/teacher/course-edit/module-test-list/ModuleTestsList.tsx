import React, { useState } from 'react';
import { Test } from '../../../../modules/test';
import EditForm from '../edit-form/EditForm';

interface ModuleTestsListProps {
  tests: Test[] | undefined;
  onUpdateTest: (testId: string, updatedTest: Partial<Test>) => void;
  onDeleteTest: (testId: string) => void; // Add a prop for deleting tests
}

const ModuleTestsList: React.FC<ModuleTestsListProps> = ({ tests, onUpdateTest, onDeleteTest }) => {
  const [hiddenTests, setHiddenTests] = useState<{ [key: string]: boolean }>({});
  const [editingTest, setEditingTest] = useState<Test | null>(null);

  const toggleTestVisibility = (testId: string) => {
    setHiddenTests(prevState => ({
      ...prevState,
      [testId]: !prevState[testId],
    }));
  };

  const handleEditClick = (test: Test) => {
    setEditingTest(test);
  };

  const handleEditSubmit = (updatedTest: Partial<Test>) => {
    if (editingTest) {
      onUpdateTest(String(editingTest.id), updatedTest);
      setEditingTest(null);
    }
  };

  const handleDeleteClick = (testId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот тест?')) {
      onDeleteTest(testId);
    }
  };

  if (!tests || tests.length === 0) return null;

  return (
    <div className="module__section">
      <h4 className="module__section-title">Тесты</h4>
      <ul className="module__list">
        {tests.map(test => {
          const isHidden = hiddenTests[String(test.id)];
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
                    <button
                      className="module__edit-button"
                      onClick={() => handleEditClick(test)}
                    >
                      Редактировать
                    </button>
                    <button
                      className="module__toggle-button"
                      onClick={() => toggleTestVisibility(String(test.id))}
                    >
                      {isHidden ? 'Показать' : 'Скрыть'}
                    </button>
                    <button
                      className="module__delete-button"
                      onClick={() => handleDeleteClick(String(test.id))}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </li>
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