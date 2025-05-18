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
            <li><a href="/courses">Все курсы</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-subtitle">Контакты</h4>
          <ul className="footer-links">
            <li><a href="tel:+74951234567">+7 (495) 123-45-67</a></li>
            <li><a href="mailto:info@coding.ru">info@coding.ru</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-container">
          <p className="copyright">© {currentYear} Coding.</p>
        </div>
      </div>
    </footer>
  );
};

export default Foooter;