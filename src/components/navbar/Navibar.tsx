import { useState } from "react";
import "./Navibar.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const Navibar = () => {
  const [isOpen, setIsOpen] = useState(false); // Управляет открытием/закрытием окна
  // const dispatch = useDispatch();
  const is_authenticated = useSelector((state: RootState) => state.auth.is_authenticated);
  const user_name = useSelector((state: RootState) => state.auth.user_name);
  const user_id = useSelector((state: RootState) => state.auth.user_id);

  return (
    <div className="navibar">
      <div className="navibar__logo-menu">
        <div className="navibar__logo-menu__logo">
          <img
            src="../../logo3.svg"
            alt="logo"
            width={50}
            height={50}
            className="navibar__logo"
          />
          <div className="navibar__logo-menu__name">Coding</div>
        </div>
        <div className="navibar__menu">
          {is_authenticated && <div><Link to={"/schedule"} className="navibar__menu__link">Расписание</Link></div> }
          <div ><Link to={"/courses"} className="navibar__menu__link">Курсы</Link></div>
          <div ><Link to={"/teachers"} className="navibar__menu__link">Преподаватели</Link></div>
        </div>
      </div>

        {is_authenticated ? 
          <div className="navibar__profile" onClick={() => setIsOpen(!isOpen)}>
            <div className="navbar__profile__name">{user_name}</div>
            {/* Выпадающее окно */}
            {isOpen && (
              <div className="navbar__dropdown">
                <Link to={`/user/${user_id}`}><p>Профиль</p></Link>
                <p>Настройки</p>
                <p>Выйти</p>
              </div>
            )}
          </div>
        :
        <><div className="navibar__login">
            <div style={{color:'white'}}><Link to={"/login"} className="navibar__login__name">Вход</Link></div>
          </div>
          </>
        }
    </div>
  );
};

export default Navibar;
