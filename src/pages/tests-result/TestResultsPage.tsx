import { useEffect, useState } from 'react';
import './TestResultsPage.css';
import { AnswerVariant, Question, Test } from '../../modules/test';
import api from '../../modules/login';
import { set } from 'date-fns';
import Navibar from '../../components/navbar/Navibar';

// Актуальная структура ответа студента
interface StudentAnswer {
  id: number;
  question_id: number;
  student_id: number;
  test_id: number;
  selected_answer_ids: number[]; // Массив ID выбранных ответов
  result: boolean;              // Результат ответа (верно/неверно)
  points_earned: number;        // Заработанные баллы
}

interface ConpletedTest {
  id: number;
  test_id: number;
  student_id: number;
  points: number;
}

// Компонент для отображения результатов теста
const TestResultsPage = () => {
  const [testData, setTestData] = useState<Test | null>(null);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [maxScore, setMaxScore] = useState<number>(0);
  const [completedTest, setCompletedTest] = useState<ConpletedTest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const testID = Number(window.location.pathname.split('/').pop());

  const [error, setError] = useState<string | null>(null);
  const [rightAnswers, setRightAnswers] = useState<AnswerVariant[]>([]);
  const [studentAnswersData, setStudentAnswersData] = useState<{
    answers: StudentAnswer[];
    total_score: number;
    question_scores?: Array<{
      question_id: number;
      earned_points: number;
    }>;
  } | null>(null);

  // Получение данных теста с сервера
  const getTest = async () => {
    try {
      setLoading(true);
      console.log('Загрузка теста...');
      const response = await api.get(`/courses/1/test/${testID}`);
      const testData = response.data.test;
      setTestData(testData);
      
      // Проверяем, что questions существует и это массив
      if (Array.isArray(testData.questions)) {
        console.log('Вопросы:', testData.questions);
        
        // Расчет максимально возможного балла
        const max = testData.questions.reduce((sum:number, question:Question) => sum + (question.points || 0), 0);
        setMaxScore(max);
      } else {
        console.error('Вопросы не являются массивом:', testData.questions);
        setError('Не удалось загрузить вопросы теста');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Ошибка получения теста', error);
      setError('Не удалось загрузить тест. Пожалуйста, попробуйте позже.');
      setLoading(false);
    }
  };

  const getRightAnswers = async() => {
    try {
      const response = await api.get(`/test/${testID}/rightAnswers`);
      const answersData = response.data.right_answers;
      console.log('Правильные ответы:', answersData);
      setRightAnswers(answersData || []);
    } catch (error) {
      console.error('Ошибка получения правильных ответов', error);
    }
  }

  const getStudentAnswers = async() => {
    try {
      const response = await api.get(`/test/${testID}/studentAnswers`);
      console.log('Ответ API студента:', response.data);
      
      // Сохраняем все данные о результатах студента
      setStudentAnswersData(response.data);
    }
    catch (error) {
      console.error('Ошибка получения ответов студента', error);
    }
  }

  const getCopletedTest = async() => {
    try {
      const response = await api.get(`/test/${testID}/finish`);
      const comletedTestData = response.data.completed_test;
      setCompletedTest(comletedTestData || null);
      console.log('Данные о завершенном тесте:', comletedTestData);
    }
    catch (error) {
      console.error('Ошибка получения статуса завершения теста', error);
    }
  }

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    const loadData = async () => {
      await getTest();
      await getRightAnswers();
      await getStudentAnswers();
      await getCopletedTest();
    };
    
    loadData();
  }, []);

  // Отладочный эффект для проверки данных
  useEffect(() => {
    console.log('Текущие данные:');
    console.log('Тест:', testData);
    console.log('Правильные ответы:', rightAnswers);
    console.log('Ответы студента:', studentAnswersData);
    
    // Вывод структуры первого ответа студента для отладки
    if (studentAnswersData && studentAnswersData.answers && studentAnswersData.answers.length > 0) {
      const firstAnswer = studentAnswersData.answers[0];
      console.log('Пример структуры ответа студента:', firstAnswer);
      console.log('question_id:', firstAnswer.question_id);
      console.log('selected_answer_ids:', firstAnswer.selected_answer_ids);
      console.log('result:', firstAnswer.result);
    }
    
    // Если есть данные о баллах студента, устанавливаем общий балл
    if (studentAnswersData && studentAnswersData.total_score) {
      setTotalScore(studentAnswersData.total_score);
    }
  }, [testData, rightAnswers, studentAnswersData]);

  // Функция для определения выбран ли вариант ответа студентом
  const isAnswerSelected = (questionId: number, answerId: number): boolean => {
    if (!studentAnswersData || !studentAnswersData.answers || studentAnswersData.answers.length === 0) return false;
    
    // Ищем ответы для данного вопроса
    const questionAnswers = studentAnswersData.answers.filter(a => a.question_id === questionId);
    
    // Проверяем, есть ли выбранный ответ в массиве selected_answer_ids
    return questionAnswers.some(answer => 
      answer.selected_answer_ids.includes(answerId)
    );
  };

  // Проверяем, является ли ответ правильным на основе данных из API
  const isRightAnswer = (answerId: number): boolean => {
    if (!rightAnswers || rightAnswers.length === 0) return false;
    
    return rightAnswers.some(answer => answer.id === answerId);
  };

  // Проверяем, является ли выбранный студентом ответ правильным
  const isCorrectAnswer = (questionId: number, answerId: number): boolean => {
    if (!studentAnswersData || !studentAnswersData.answers || studentAnswersData.answers.length === 0) return false;
    
    // Ищем ответы студента для данного вопроса
    const questionAnswer = studentAnswersData.answers.find(answer => 
      answer.question_id === questionId && answer.selected_answer_ids.includes(answerId)
    );
    
    // Если ответ найден, и он правильный согласно полю result
    return questionAnswer ? questionAnswer.result : false;
  };
  
  // Функция для получения заработанных баллов за вопрос
  const getQuestionScore = (questionId: number): number => {
    // Сначала проверяем, есть ли баллы в question_scores
    if (studentAnswersData && studentAnswersData.question_scores) {
      const questionScore = studentAnswersData.question_scores.find(
        score => score.question_id === questionId
      );
      
      if (questionScore) {
        return questionScore.earned_points;
      }
    }
    
    // Если question_scores нет, берём points_earned из ответов
    if (studentAnswersData && studentAnswersData.answers) {
      const questionAnswers = studentAnswersData.answers.filter(
        answer => answer.question_id === questionId
      );
      
      if (questionAnswers.length > 0) {
        // Берём points_earned из первого найденного ответа на вопрос
        return questionAnswers[0].points_earned || 0;
      }
    }
    
    return 0;
  };

  if (loading) {
    return <div className="test-container">Загрузка результатов теста...</div>;
  }

  if (error) {
    return <div className="test-container error-message">{error}</div>;
  }

  if (!testData) {
    return <div className="test-container">Нет данных для отображения</div>;
  }

  return (
    <>
     <Navibar />
    <div className="test-container-result">
      <h1 className="test-header">{testData.name}</h1>
      <p className="test-description">{testData.description}</p>
      
      {testData.questions && testData.questions.map((question) => (
        <div key={question.id} className="question-card">
          <h3 className="question-text">{question.text}</h3>
          
          <ul className="answer-list">
            {question.answers && question.answers.map((answer) => {
              const selected = isAnswerSelected(question.id, answer.id);
              const isRight = isRightAnswer(answer.id);
              const correct = selected && isRight;

              let answerClass = "answer-item";
              
              // Если ответ выбран студентом
              if (selected) {
                // Если ответ правильный - зеленый
                if (isRight) {
                  answerClass += " answer-correct";
                } 
                // Если ответ неправильный - красный
                else {
                  answerClass += " answer-incorrect";
                }
              } 
              // Если ответ не выбран, но является правильным - показываем как пропущенный правильный
              else if (isRight) {
                answerClass += " answer-right";
              }

              return (
                <li key={answer.id} className={answerClass}>
                  {selected && isRight && <span className="check-icon">✓</span>}
                  {selected && !isRight && <span className="cross-icon">✗</span>}
                  {!selected && isRight && <span className="right-answer-icon">★</span>}
                  {answer.text}
                </li>
              );
            })}
          </ul>
          
          <div className="score-section">
            Получено баллов: {getQuestionScore(question.id)} из {question.points || 0}
          </div>
        </div>
      ))}
      
      <div className="total-score-card">
        Итоговый результат: {completedTest?.points} из {maxScore} баллов 
        <span className="score-percent">
          {maxScore > 0 ? Math.round(((studentAnswersData?.total_score || totalScore) / maxScore) * 100) : 0}%
        </span>
      </div>
    </div>
    </>
  );
};

export default TestResultsPage;