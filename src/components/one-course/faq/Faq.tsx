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
    question: "Нужны ли начальные знания для прохождения курса?",
    answer: "Нет, курс разработан специально для новичков. Мы начинаем с самых основ и постепенно переходим к более сложным темам. Вам понадобится только компьютер с доступом в интернет и желание учиться."
  },
  {
    question: "Сколько времени занимает прохождение курса?",
    answer: "Полная программа курса рассчитана на 8 недель обучения. В среднем вам потребуется уделять 10-15 часов в неделю для изучения материалов и выполнения практических заданий. Но вы можете учиться в своем темпе, доступ к материалам курса останется у вас навсегда."
  },
  {
    question: "Как проходит обучение?",
    answer: "Обучение включает видеолекции, практические задания, тесты для проверки знаний и работу над проектами. У вас будет доступ к закрытому чату с преподавателем и другими студентами, где вы сможете задавать вопросы и получать обратную связь."
  },
  {
    question: "Получу ли я сертификат после окончания курса?",
    answer: "Да, после успешного завершения курса и выполнения всех практических заданий вы получите сертификат об окончании курса. Сертификат можно добавить в ваше резюме и профиль LinkedIn."
  },
  {
    question: "Есть ли у вас система рассрочки?",
    answer: "Да, мы предлагаем возможность оплаты курса в рассрочку. Вы можете разделить стоимость курса на 3 или 6 платежей без переплаты. Подробности можно узнать у наших менеджеров."
  }
];

export default FAQ;