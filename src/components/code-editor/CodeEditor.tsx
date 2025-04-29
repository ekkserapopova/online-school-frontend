import React, { useState, useEffect, FC } from 'react';
import CodeMirror, { basicSetup } from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { dracula } from '@uiw/codemirror-theme-dracula';
import "./CodeEditor.css"

interface CodeEditorProps {
  title?: string;
  description?: string;
  onSubmit: () => void;
  code: string;
  setCode: (code: string) => void;
}

const CodeEditorWithCodemirror: FC<CodeEditorProps> = ({ title, description, onSubmit, code, setCode }) => {

  const [output, setOutput] = useState<string>('');
  const [pyodideLoaded, setPyodideLoaded] = useState<boolean>(false);
  const [pyodideInstance, setPyodideInstance] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadPyodide = async () => {
      setLoading(true);
      try {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
        script.async = true;
        script.onload = async () => {
          try {
            // @ts-ignore
            const pyodide = await window.loadPyodide();
            setPyodideInstance(pyodide);
            setPyodideLoaded(true);
            setLoading(false);
          } catch (err) {
            console.error('Ошибка инициализации Pyodide:', err);
            setOutput('Ошибка загрузки Python интерпретатора. Попробуйте перезагрузить страницу.');
            setLoading(false);
          }
        };
        script.onerror = () => {
          setOutput('Не удалось загрузить интерпретатор Python. Проверьте соединение с интернетом.');
          setLoading(false);
        };
        document.body.appendChild(script);
      } catch (err) {
        console.error('Ошибка загрузки Pyodide:', err);
        setLoading(false);
      }
    };

    loadPyodide();

    return () => {
      const script = document.querySelector('script[src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"]');
      if (script) script.remove();
    };
  }, []);

  const onChange = React.useCallback((value: string) => {
    setCode(value);
  }, []);

  const runCode = async () => {
    if (!pyodideLoaded || !pyodideInstance) {
      setOutput('Интерпретатор Python еще загружается. Подождите...');
      return;
    }

    setOutput('Выполнение...');

    try {
      pyodideInstance.runPython(`
        import sys
        from io import StringIO
        sys.stdout = StringIO()
      `);

      pyodideInstance.runPython(code);

      const stdout = pyodideInstance.runPython("sys.stdout.getvalue()");
      setOutput(stdout);

      pyodideInstance.runPython(`
        sys.stdout = sys.__stdout__
      `);
    } catch (err) {
      setOutput(`Ошибка: ${err}`);
    }
  };

  return (
    <div className="editor">
      <div className="editor__container">
        <div className="editor__title">{title}</div>
        <div className="editor__description">{description}</div>
        <div className="editor__code-box">
          <div className="editor__header">
            <span className="editor__filename">main.py</span>
            <div className="editor__controls">
              <button
                className="editor__send-button"
                onClick={runCode}
                disabled={!pyodideLoaded || loading}
                style={{
                  cursor: pyodideLoaded ? 'pointer' : 'not-allowed',
                  opacity: pyodideLoaded ? 1 : 0.7
                }}
              >
                {loading ? 'Загрузка Python...' : 'Запустить код'}
              </button>
              <button
                className="editor__send-button"
                style={{ backgroundColor: '#2196F3' }}
                onClick={onSubmit}
              >
                Сохранить
              </button>
            </div>
          </div>
          <div className="editor__body">
            <CodeMirror
              value={code}
              height="300px"
              theme={dracula}
              extensions={[...basicSetup({
                                  lineNumbers: false,     // Отключаем номера строк
                                  foldGutter: false       // Отключаем индикаторы сворачивания
                                }), python()]}
              onChange={onChange}
              style={{ fontSize: '14px', width: '100%' }}
            />
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <h3>Результат выполнения:</h3>
          <pre style={{
            padding: '15px',
            background: '#2b2b2b',
            color: '#f8f8f2',
            border: '1px solid #444',
            borderRadius: '4px',
            whiteSpace: 'pre-wrap',
            minHeight: '100px',
            maxHeight: '300px',
            overflow: 'auto'
          }}>
            {output || "Результат будет отображен здесь после запуска кода"}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorWithCodemirror;
