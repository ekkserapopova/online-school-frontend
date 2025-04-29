import { FC } from "react";
import { Link } from "react-router-dom";
import "./SideMenu.css";


const SideMenu: FC = () => {
  return (
    <>
      
      <div className={`side-menu open`}>
        
        <div className="menu-content">
          <ul className="menu-list">
            <li>
              <Link to="/my-courses" className="menu-item">
                <span>Мои курсы</span>
              </Link>
            </li>
            <li>
              <Link to="/statistics" className="menu-item">
                <span>Статистика</span>
              </Link>
            </li>
            <li>
              <Link to="/logout" className="menu-item">
                <span>Выход</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SideMenu;