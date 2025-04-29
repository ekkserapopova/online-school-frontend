// Footer.tsx
import React from 'react';
import './Foooter.css';

const Foooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Coding</h3>
          <p className="footer-description">
            Онлайн школа программирования для всех уровней - от новичков до профессионалов.
          </p>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-subtitle">Курсы</h4>
          <ul className="footer-links">
            <li><a href="/courses/frontend">Frontend разработка</a></li>
            <li><a href="/courses/backend">Backend разработка</a></li>
            <li><a href="/courses/mobile">Мобильная разработка</a></li>
            <li><a href="/courses/data-science">Data Science</a></li>
            <li><a href="/courses/all">Все курсы</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-subtitle">О нас</h4>
          <ul className="footer-links">
            <li><a href="/about">О школе</a></li>
            <li><a href="/mentors">Преподаватели</a></li>
            <li><a href="/reviews">Отзывы</a></li>
            <li><a href="/blog">Блог</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-subtitle">Контакты</h4>
          <ul className="footer-links">
            <li><a href="tel:+74951234567">+7 (495) 123-45-67</a></li>
            <li><a href="mailto:info@codemasters.ru">info@codemasters.ru</a></li>
            {/* <li className="social-links">
              <a href="https://t.me/codemasters" aria-label="Telegram">
                <i className="icon icon-telegram"></i>
              </a>
              <a href="https://vk.com/codemasters" aria-label="VKontakte">
                <i className="icon icon-vk"></i>
              </a>
              <a href="https://youtube.com/codemasters" aria-label="YouTube">
                <i className="icon icon-youtube"></i>
              </a>
            </li> */}
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-container">
          <p className="copyright">© {currentYear} CodeMasters. Все права защищены.</p>
          {/* <div className="footer-legal">
            <a href="/privacy">Политика конфиденциальности</a>
            <a href="/terms">Пользовательское соглашение</a>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Foooter;