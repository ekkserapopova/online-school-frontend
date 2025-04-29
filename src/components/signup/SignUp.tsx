import { FC } from "react";
import "./SignUp.css";
import { Link } from "react-router-dom";

interface LoginProps {
  valueName: string;
  valueSurname: string;
  valueEmail: string;
  valuePhone: string;
  valueBirth: string; 
  valuePassword: string;
  valueRole: string;
  setvalueName: (value: string) => void;
  setvalueSurname: (value: string) => void;
  setvalueEmail: (value: string) => void;
  setvaluePhone: (value: string) => void;
  setvalueBirth: (value: string) => void;
  setvaluePassword: (value: string) => void;
  setvalueRole: (value: string) => void;
  onClickignUp?: () => void
}

const SignUp: FC<LoginProps> = ({
  valueName,
  valueSurname,
  valueEmail,
  valuePhone,
  valueBirth,
  valuePassword,
  valueRole,
  setvalueName,
  setvalueSurname,
  setvalueEmail,
  setvaluePhone,
  setvalueBirth,
  setvaluePassword,
  setvalueRole,
  onClickignUp
}) => {
  return (
    <div className="signup-container">
      {/* <img
        src="../../logo3.svg"
        alt="logo"
        width={50}
        height={50}
        className="signup-logo"
      /> */}
      <div className="signup-name">Регистрация</div>
      <div className="signup-input">
        {/* Имя */}
        <div className="signup-input__name">
          <div className="signup-name-text">Имя</div>
          <input
            onChange={(event) => setvalueName(event.target.value)}
            value={valueName}
            type="text"
            className="signup-input-name"
          />
        </div>

        {/* Фамилия */}
        <div className="signup-surname">
          <div className="signup-surname-text">Фамилия</div>
          <input
            onChange={(event) => setvalueSurname(event.target.value)}
            value={valueSurname}
            type="text"
            className="signup-input-surname"
          />
        </div>

        {/* День рождения */}
        <div className="signup-birth">
          <div className="signup-birth-text">День рождения</div>
          <input
            onChange={(event) => setvalueBirth(event.target.value)}
            value={valueBirth}
            type="date"
            className="signup-input-birth"
          />
        </div>

        {/* Телефон */}
        <div className="signup-phone">
          <div className="signup-phone-text">Телефон</div>
          <input
            onChange={(event) => setvaluePhone(event.target.value)}
            value={valuePhone}
            type="tel"
            className="signup-input-phone"
            // placeholder="+7 (999) 123-45-67"
          />
        </div>

        {/* Почта */}
        <div className="signup-input__email">
          <div className="signup-email-text">Почта</div>
          <input
            onChange={(event) => setvalueEmail(event.target.value)}
            value={valueEmail}
            type="email"
            className="signup-input-email"
          />
        </div>

        {/* Пароль */}
        <div className="signup-input__password">
          <div className="signup-password-text">Пароль</div>
          <input
            onChange={(event) => setvaluePassword(event.target.value)}
            value={valuePassword}
            type="password"
            className="signup-input-password"
          />
        </div>

        {/* Роль */}
        <div className="signup-role">
          <div className="signup-role-text">Роль</div>
          <select
            onChange={(event) => setvalueRole(event.target.value)}
            value={valueRole}
            className="signup-input-role"
          >
            <option value="Ученик">Ученик</option>
            <option value="Преподаватель">Преподаватель</option>
          </select>
        </div>
      </div>

      <div className="signup-button" onClick={onClickignUp}>Зарегистрироваться</div>
      <div className="signup-signup">
        Уже зарегистрированы? <Link to={"/login"} className="signup-link">Войти</Link>
      </div>
    </div>
  );
};

export default SignUp;
