import React, { useState } from 'react';
import './FAQ.css';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items?: FAQItem[];
  title?: string;
}

const FAQ: React.FC<FAQProps> = ({ 
  items = defaultFAQItems,
  title = "Часто задаваемые вопросы" 
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h2 className="faq-title">{title}</h2>
      <div className="faq-list">
        {items.map((item, index) => (
          <div 
            key={index} 
            className={`faq-item ${openIndex === index ? 'active' : ''}`}
          >
            <div 
              className="faq-question" 
              onClick={() => toggleQuestion(index)}
            >
              <h3>{item.question}</h3>
              <div className="faq-icon">
                <span className="faq-icon-bar"></span>
                <span className="faq-icon-bar"></span>
              </div>
            </div>
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// Дефолтные вопросы и ответы
const defaultFAQItems: FAQItem[] = [
  {
    question: "Как работает автоматическая проверка кода?",
    answer: "Наша инновационная система использует искусственный интеллект для анализа вашего кода. Она не только проверяет корректность работы программы, но и оценивает качество написания кода, выявляет возможные ошибки и дает персонализированные рекомендации по улучшению. Это помогает быстрее осваивать навыки профессионального программирования."
  },
  {
    question: "Нужны ли начальные знания для прохождения курсов?",
    answer: "В зависмости от уровня сложности курса. Есть курсы, которые специально разработаны для новичков и не требуют предварительных знаний в программировании. Вы можете начать с нуля и постепенно продвигаться к более сложным темам. Для опытных программистов мы предлагаем курсы с углубленным изучением специализированных тем."
  },
  {
    question: "На каких языках программирования я смогу писать код?",
    answer: "Наша платформа поддерживает множество современных языков программирования, включая Python, JavaScript, Java, C++, PHP и другие. Вы можете выбрать конкретный курс по интересующему вас языку или изучать несколько языков параллельно."
  },
  {
    question: "Как быстро я получу ответ от системы проверки кода?",
    answer: "Автоматическая проверка происходит мгновенно — результаты анализа вашего кода вы получите в течение нескольких секунд после отправки решения. Это позволяет быстро исправлять ошибки и эффективнее усваивать материал."
  },
  {
    question: "Смогу ли я сохранить историю проверок моего кода?",
    answer: "Да, все ваши отправленные решения и результаты проверок сохраняются в личном кабинете. Вы сможете в любой момент вернуться к предыдущим заданиям, проанализировать свой прогресс и увидеть, как развивались ваши навыки программирования с течением времени."
  }
];


export default FAQ;