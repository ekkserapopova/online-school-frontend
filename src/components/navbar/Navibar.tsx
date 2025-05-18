import { useState } from "react";
import "./Navibar.css";
import { Link, useNavigate, useLocation } from "react-router-dom"; // добавляем useLocation
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { loginUser } from "../../store/slices/authSlice";

const Navibar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const is_authenticated = useSelector((state: RootState) => state.auth.is_authenticated);
  const is_teacher = useSelector((state: RootState) => state.auth.is_teacher);
  const user_name = useSelector((state: RootState) => state.auth.user_name);
  // const user_id = useSelector((state: RootState) => state.auth.user_id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Добавляем хук для получения текущего пути
  const location = useLocation();

 
  
  // Функция для проверки активного маршрута
  const isActiveRoute = (path: string) => {
    // Для путей /courses и /teacher/courses
    if (path === '/courses' && location.pathname === '/courses') {
      return true;
    }
    // Для пути /schedule (Моё обучение)
    if (path === '/schedule' && location.pathname === '/schedule') {
      return true;
    }
    // Для пути /teacher/courses (Курсы преподавателя)
    if (path === '/teacher/courses' && location.pathname.startsWith('/teacher/courses')) {
      return true;
    }
    return false;
  };
  
  // Функция для получения инициалов из имени пользователя
  const getInitials = (name: string) => {
    if (!name) return '?';
    
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
  };
  
  const logOut = () => {
    localStorage.removeItem("auth_token");
    dispatch(
            loginUser({
              user_id: null,
              is_authenticated: false,
              user_name: '',
              is_teacher: false,
            })
          );
    navigate("/login");
  };
  
  return (
    <div className="navibar">
      <div className="navibar__logo-menu">
        <div className="navibar__logo-menu__logo">
          <Link to={"/"} className="navibar__logo-menu__link">
          <img
            src="../../logo3.svg"
            alt="logo"
            width={50}
            height={50}
            className="navibar__logo"
          />
          <div className="navibar__logo-menu__name">Coding</div>
          </Link>
        </div>
        <div className="navibar__menu">
          {is_authenticated &&
          is_teacher ?
          <div className={isActiveRoute('/teacher/courses') ? 'active' : ''}>
            <Link to={"/teacher/courses"} className="navibar__menu__link">Курсы</Link>
          </div>
          :
          (<>
            {is_authenticated && 
              <div className={isActiveRoute('/schedule') ? 'active' : ''}>
                <Link to={"/schedule"} className="navibar__menu__link">Моё обучение</Link>
              </div>
            }
            <div className={isActiveRoute('/courses') ? 'active' : ''}>
              <Link to={"/courses"} className="navibar__menu__link">Курсы</Link>
            </div>
           </>)
          }
        </div>
      </div>

      {is_authenticated ? 
        <div className="navibar__profile" onClick={() => setIsOpen(!isOpen)}>
          {/* Добавляем аватар с инициалами */}
          <div className="navbar__profile__avatar">
            {getInitials(user_name)}
          </div>
          <div className="navbar__profile__name">{user_name}</div>
          {/* Выпадающее окно */}
          {isOpen && (
            <div className="navbar__dropdown">
              {/* <Link to={`/user/${user_id}`}><p>Профиль</p></Link>
              <p>Настройки</p> */}
              <p onClick={logOut}>Выйти</p>
            </div>
          )}
        </div>
      :
      <div className="navibar__login">
        <div style={{color:'white'}}><Link to={"/login"} className="navibar__login__name">Вход</Link></div>
      </div>
      }
    </div>
  );
};

export default Navibar;