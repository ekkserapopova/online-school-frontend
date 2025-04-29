import React, { useState, useEffect } from 'react';
import CodeMirror, { basicSetup } from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { dracula } from '@uiw/codemirror-theme-dracula';

const CodeEditorWithCodemirror: React.FC = () => {
  const [code, setCode] = useState<string>(
    `# Пример кода на Python\ndef greeting(name):\n    return f"Привет, {name}!"\n\n# Вызываем функцию\nprint(greeting("Пользователь"))\n\n# Можно использовать базовые математические операции\nresult = 5 * 10\nprint(f"Результат: {result}")`
  );
  const [output, setOutput] = useState<string>('');
  const [pyodideLoaded, setPyodideLoaded] = useState<boolean>(false);
  const [pyodideInstance, setPyodideInstance] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Загружаем Pyodide при монтировании компонента
  useEffect(() => {
    const loadPyodide = async () => {
      setLoading(true);
      try {
        // Динамически импортируем скрипт Pyodide
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
      // Очистка при размонтировании компонента
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
      // Переопределяем print для перехвата вывода
      pyodideInstance.runPython(`
        import sys
        from io import StringIO
        sys.stdout = StringIO()
      `);
      
      // Выполняем код пользователя
      pyodideInstance.runPython(code);
      
      // Получаем вывод
      const stdout = pyodideInstance.runPython("sys.stdout.getvalue()");
      setOutput(stdout);
      
      // Сбрасываем stdout для следующего запуска
      pyodideInstance.runPython(`
        sys.stdout = sys.__stdout__
      `);
    } catch (err) {
      setOutput(`Ошибка: ${err}`);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Редактор Python кода</h2>
      <p>Введите код Python ниже:</p>
      
      <div style={{ 
        border: '1px solid #444', 
        borderRadius: '4px',
        overflow: 'hidden',
        marginBottom: '20px'
      }}>
        <CodeMirror
          value={code}
          height="300px"
          theme={dracula}
          extensions={[...basicSetup(), python()]}
          onChange={onChange}
          style={{ fontSize: '14px' }}
        />
      </div>
      
      <div>
        <button 
          style={{
            padding: '8px 16px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: pyodideLoaded ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            marginRight: '10px',
            opacity: pyodideLoaded ? 1 : 0.7
          }}
          onClick={runCode}
          disabled={!pyodideLoaded || loading}
        >
          {loading ? 'Загрузка Python...' : 'Запустить код'}
        </button>
        <button 
          style={{
            padding: '8px 16px',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
          onClick={() => alert("Код сохранен!")}
        >
          Сохранить
        </button>
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
  );
};

export default CodeEditorWithCodemirror;