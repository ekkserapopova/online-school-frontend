import React from "react";
import "./HomePage.css";
import Navibar from "../../components/navbar/Navibar";

const HomePage: React.FC = () => {
  return (
    <>
    <Navibar/>
    <div className="homepage">
      <header className="header">
        <h1>Онлайн-школа программирования</h1>
        <p>Прокачай навыки. Кодь. Расти. Получай мгновенную обратную связь.</p>
        <button className="cta-button">Записаться на курс</button>
      </header>
      <div className="content">
        <section className="about">
          <h2>О нас</h2>
          <p>
            Мы обучаем программированию с нуля и до уровня confident middle. Наши курсы
            — это практические задания, реальные проекты и индивидуальная работа с ментором.
          </p>
          <p>
            Но главное — <strong>автоматическая проверка кода с помощью нейросети</strong>. Быстрая, точная, честная. Никакого ожидания.
          </p>
        </section>

        <section className="benefits">
          <h2>Почему выбирают нас?</h2>
          <ul className="benefits-list">
            <li>
              <img src="/icons/practice.svg" alt="Практика" />
              <strong>Практика</strong>
              <p>80% времени вы пишете код, решаете задачи и работаете над проектами.</p>
            </li>
            <li>
              <img src="/icons/mentor.svg" alt="Менторы" />
              <strong>Менторы</strong>
              <p>Опытные разработчики помогут вам на каждом этапе обучения.</p>
            </li>
            <li>
              <img src="/icons/ai.svg" alt="Искусственный интеллект" />
              <strong>Искусственный интеллект</strong>
              <p>Мгновенная проверка кода и рекомендации от нейросети.</p>
            </li>
          </ul>
        </section>

        <section className="reviews">
          <h2>Отзывы наших студентов</h2>
          <ul className="reviews-list">
            <li>
              <p>“Курсы помогли мне получить первую работу в IT. Автоматическая проверка — это просто находка!”</p>
              <strong>— Анна, Junior Developer</strong>
            </li>
            <li>
              <p>“Очень понравился подход к обучению. Менторы всегда на связи, а задания интересные.”</p>
              <strong>— Иван, Frontend Developer</strong>
            </li>
          </ul>
        </section>

        <section className="faq">
          <h2>FAQ</h2>
          <ul>
            <li>
              <strong>Нужны ли базовые знания?</strong>
              <p>Нет, мы обучаем с нуля.</p>
            </li>
            <li>
              <strong>Как быстро проверяется код?</strong>
              <p>Мгновенно. Проверка запускается сразу после отправки задания.</p>
            </li>
            <li>
              <strong>Кто проверяет код?</strong>
              <p>Наша система на основе нейросети (LLM), обученная на реальных примерах.</p>
            </li>
          </ul>
        </section>
      </div>
    </div>
    </>
  );
};

export default HomePage;