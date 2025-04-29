import { FC } from "react"
import './LogIn.css'
import { Link } from "react-router-dom"

interface LoginProps {
    valueEmail : string
    valuePassword : string
    setvalueEmail : (valueEmail : string) => void
    setvaluePassword : (valuePassword : string) => void

    onSubmit:()=>void
}
const LogIn: FC<LoginProps> = ({valueEmail, valuePassword, setvalueEmail, setvaluePassword, onSubmit}) =>{
//   const [darkMode, setDarkMode] = useState(false);

//   const toggleTheme = () => {
//     setDarkMode(!darkMode);
//     document.body.classList.toggle("dark-mode", !darkMode);
//   };

  return (
    <div className="login-container">
            {/* <img src="../../logo3.svg" alt="logo" width={50} height={50} className="auth-logo" /> */}
                <div className="login-container__name">Авторизация</div>
                <div className="login-container__input">
                    <div className="login-container__input__email">
                        <div className="login-container__input__name">Почта</div>
                        <input onChange={(event => setvalueEmail(event.target.value))} value={valueEmail} type="text" className="auth-input-email" />
                    </div>
                    <div className="login-container__input__password">
                        <div className="login-container__input__name">Пароль</div>
                        <input onChange={(event => setvaluePassword(event.target.value))} value={valuePassword} type="password" className="auth-input-password" />
                    </div>
                </div>
                <div className="login-container__button" onClick={onSubmit}>Войти</div>
                <div className="login-container__no-signup">Не зарегистрированы? <Link to={"/signup"} className="signup-link">Регистрация</Link></div>
            
    </div>
  );
};


export default LogIn