import React from 'react';
import CodeMirror, { basicSetup } from '@uiw/react-codemirror';
import {vscodeDark} from '@uiw/codemirror-theme-vscode';
import { python } from '@codemirror/lang-python';
import { EditorView } from '@codemirror/view';

import './TaskResult.css';

interface AssignmentViewerProps {
  title: string;
  description: string;
  code: string;
  grade: string | number;
  recommendations: string;
  dueDate: string;
}

const AssignmentViewer: React.FC<AssignmentViewerProps> = ({
  title,
  description,
  code,
  grade,
  recommendations,
  dueDate
}) => {
  return (
    <div className="assignment">
      <div className="assignment__header">
        <h1 className="assignment__title">{title}</h1>
        <div className="assignment__meta">
          <span className="assignment__due-date">Сдано: {dueDate}</span>
          <span className="assignment__grade">Оценка: {grade}</span>
        </div>
      </div>
      
      <div className="assignment__section">
        <h2 className="assignment__section-title">Описание задания</h2>
        <p className="assignment__content">{description}</p>
      </div>
      
      <div className="assignment__section">
        <h2 className="assignment__section-title">Решение</h2>
        <div className="assignment__code-editor">
          <CodeMirror
            value={code}
            height="280px"
            theme={vscodeDark}
            readOnly={true}
            extensions={[
                ...basicSetup({
                    lineNumbers: false,     // Отключаем номера строк
                    foldGutter: false       // Отключаем индикаторы сворачивания
                  }),
              python(),
              EditorView.editable.of(false),
              EditorView.contentAttributes.of({ contenteditable: 'false' }),
              EditorView.theme({
                '&': { cursor: 'default !important' },
                '.cm-content': { userSelect: 'text', cursor: 'default' },
                '.cm-line': { cursor: 'default' },
                '.cm-gutters': { userSelect: 'none', cursor: 'default' }
              })
            ]}
          />
        </div>
      </div>
      
      <div className="assignment__section">
        <h2 className="assignment__section-title">Обратная связь</h2>
        <p className="assignment__content">{recommendations}</p>
      </div>
    </div>
  );
};

export default AssignmentViewer;