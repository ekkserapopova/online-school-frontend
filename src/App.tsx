import CourcesPage from './pages/courses-page/CoursesPage.tsx';
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login-page/LoginPage'
import SignupPage from './pages/signup-page/SignUpPage'
import TeachersPage from './pages/teachers-page/TeachersPage'
import OneTeacherPage from './pages/one-teacher-page/OneTeacherPage'
import ProfilePage from './pages/profile-page/ProfilePage'
import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { loginUser } from './store/slices/authSlice.ts';
import api from './modules/login.ts';
import SchedulePage from './pages/schedule-page/SchedulePage.tsx';
import CoursePage from './pages/OneCourse.tsx';
import PaymentPage from './pages/payment-page/PaymentPage.tsx';
import TestPage from './pages/test-page/TestPage.tsx';
import TestResultsPage from './pages/tests-result/TestResultsPage.tsx';
import StudentCoursePage from './pages/student-course-page/StudentCoursePage.tsx';
import CodePage from './pages/code-page/CodePage.tsx';
import CodeBlock from './pages/Ex.tsx';
import CodeEditor from './pages/Ex.tsx';
import TaskResultPage from './pages/task-result-page/TaskResultPage.tsx';
import LessonPage from './pages/ lesson-page/LessonPage.tsx';


interface UserPayload extends JwtPayload {
    user_id: string
}

function App() {
  const dispatch = useDispatch();
  // const navigate = useNavigate()


  const getInitialUserInfo = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        console.log('Пользователь не авторизован!!!');
        return;
      }

      const decodedToken = jwtDecode<UserPayload>(token);
                  
      const userId = Number(decodedToken.user_id);

      const response = await api.get(`/user/${userId}`)

      const userData = response.data.user
      

      dispatch(
        loginUser({
          user_id: userId,
          is_authenticated: true,
          user_name: userData.name
        })
      );
      
    } 
    catch (error) {
      console.log('Пользователь не авторизован!!!');
      localStorage.removeItem('auth_token');
      dispatch(
        loginUser({
          user_id: null,
          is_authenticated: false,
          user_name: null
        })
      );
      // navigate("/login")
    }
  }
  
  React.useEffect(() => {
    getInitialUserInfo();
  }, [])

  const [savedCode, setSavedCode] = useState<string>('');
  
  const handleCodeChange = (newCode: string) => {
    console.log('Код изменен:', newCode);
    setSavedCode(newCode);
  };


  return (
    <>
      <Router basename="/">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/courses" element={<CourcesPage />} />
          <Route path="/teachers" element={<TeachersPage />} />
          <Route path="/teachers/1" element={<OneTeacherPage />} />
          <Route path="/user/:id" element={<ProfilePage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/coursepreview/:id" element={<CoursePage />} />
          <Route path="/payment/:id" element={<PaymentPage />} />
          <Route path="/test/:id" element={<TestPage />} />
          <Route path="/test/results/:id" element={<TestResultsPage />} />
          <Route path="/course/:id" element={<StudentCoursePage />} />

          <Route path="/task/:id" element={<CodePage />} />
          <Route path="/task/results/:id" element={<TaskResultPage />} />

          <Route path="/lesson" element={<LessonPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
