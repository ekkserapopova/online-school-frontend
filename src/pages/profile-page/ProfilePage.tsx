import { FC, useEffect, useState } from "react";
import api from "../../modules/login";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Navibar from "../../components/navbar/Navibar";
import SideMenu from "../../components/sidemenu/SideMenu";
import "./ProfilePage.css";

interface User {
  id: number;
  name: string;
  surname: string;
  birth: Date;
  email: string;
  photo?: string; 
}

const ProfilePage: FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const user_id = useSelector((state: RootState) => state.auth.user_id);

  useEffect(() => {
    get_user();
    
  }, []);


  const get_user = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/user/${user_id}`);
      const userData = response.data.user;
      const userWithDateObject: User = {
        ...userData,
        birth: new Date(userData.birth)
      };
      setUser(userWithDateObject);
      console.log(userWithDateObject);
    } catch (error) {
      console.error("Ошибка при получении данных пользователя:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Функция для получения инициалов из имени и фамилии (для аватара)
  const getInitials = (name: string, surname: string) => {
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };


  return (
    <div className="app-container">
      {/* Навигационная панель */}
      <Navibar />
      
      {/* Боковое меню */}
      <SideMenu />
      
      {/* Основной контент */}
      <div className='content-container'>
        <div className="profile-container">
          {isLoading ? (
            <div className="loading-container">
              <div className="loader"></div>
              <p>Загрузка данных пользователя...</p>
            </div>
          ) : user ? (
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar-container">
                  {user.photo ? (
                    <img src={user.photo} alt="Аватар пользователя" className="profile-avatar" />
                  ) : (
                    <div className="profile-avatar-placeholder">
                      {getInitials(user.name, user.surname)}
                    </div>
                  )}
                  <label className="avatar-upload-btn">
                    <span className="avatar-upload-icon">+</span>
                    <input type="file" accept="image/*" style={{ display: 'none' }} />
                  </label>
                </div>
                <div className="profile-name-container">
                  <h2 className="profile-fullname">{user.name} {user.surname}</h2>
                  <p className="profile-email">{user.email}</p>
                </div>
              </div>
              
              <div className="profile-info">
                <div className="info-group">
                  <label>Имя</label>
                  <p>{user.name}</p>
                </div>
                <div className="info-group">
                  <label>Фамилия</label>
                  <p>{user.surname}</p>
                </div>
                <div className="info-group">
                  <label>Дата рождения</label>
                  <p>{formatDate(user.birth)}</p>
                </div>
                <div className="info-group">
                  <label>Email</label>
                  <p>{user.email}</p>
                </div>
              </div>
              <div className="profile-actions">
                <button className="btn-edit">Редактировать профиль</button>
                <button className="btn-secondary">Изменить пароль</button>
              </div>
            </div>
          ) : (
            <div className="error-message">
              <p>Не удалось загрузить данные пользователя.</p>
              <button className="btn-secondary" onClick={get_user}>Попробовать снова</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;