import React from 'react';
import CodeMirror, { basicSetup, EditorView } from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import {vscodeLight} from '@uiw/codemirror-theme-vscode';
import "./Innovation.css"

interface InnovationProps {
  student_code: string;
  answer_by_llm: string;
  task_description: string;
  feedback?: string; // Добавленный параметр для обратной связи
}

const Innovation: React.FC<InnovationProps> = ({
  student_code, 
  answer_by_llm, 
  task_description, 
  feedback = "Ваш код проанализирован с помощью искусственного интеллекта. Обратите внимание на рекомендации для улучшения вашего решения и изучите предложенные исправления."
}) => {
  return(
    <div className="innovation">
        <div className="innovation__name">Инновационная автоматическая проверка кода</div>
        <div className="innovation__codes-container">
          <div className="innovation__task-description">Полученное задание: {task_description}</div>

          <div className="innovation__codes">
              <div className="innovation__code-container">
                  <div className="innovation__code-name">Отправленный код</div>
                  <div className="innovation__code">
                  <CodeMirror
                      value={student_code}
                      height="280px"
                      theme={vscodeLight}
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
                          '.cm-gutters': { userSelect: 'none', cursor: 'default' },
                          '.cm-activeLine': { backgroundColor: 'transparent !important' },
                          '.cm-activeLineGutter': { backgroundColor: 'transparent !important' },
                          '.cm-selectionMatch': { backgroundColor: 'transparent !important' }
                          }),
                          EditorView.domEventHandlers({
                          mousedown: (e) => {
                              e.stopPropagation();
                              return true; // Предотвращаем стандартное поведение при клике
                          }
                          })
                      ]}
                      />
                  </div>
              </div>
              <div className="innovation__code-container">
                  <div className="innovation__code-name">Полученный ответ</div>
                  <div className="innovation__code">
                  <CodeMirror
                      value={answer_by_llm}
                      height="280px"
                      theme={vscodeLight}
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
                          '.cm-gutters': { userSelect: 'none', cursor: 'default' },
                          '.cm-activeLine': { backgroundColor: 'transparent !important' },
                          '.cm-activeLineGutter': { backgroundColor: 'transparent !important' },
                          '.cm-selectionMatch': { backgroundColor: 'transparent !important' }
                          }),
                          EditorView.domEventHandlers({
                          mousedown: (e) => {
                              e.stopPropagation();
                              return true;
                          }
                          })
                      ]}
                      />
                  </div>
              </div>
          </div>
        </div>
         {/* Новый блок обратной связи
         <div className="innovation__feedback">
            <div className="innovation__feedback-icon">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            </div>
            <div className="innovation__feedback-text">{feedback}</div>
          </div> */}
    </div>
  )
}

export default Innovation;