// Настройка axios для автоматического добавления токена
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8080/api',
});

// Добавляем перехватчик запросов
// axiosinterceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('auth_token');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default api;