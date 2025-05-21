import CourcesPage from './pages/courses-page/CoursesPage.tsx';
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login-page/LoginPage'
import SignupPage from './pages/signup-page/SignUpPage'
import OneTeacherPage from './pages/one-teacher-page/OneTeacherPage'
import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { loginUser } from './store/slices/authSlice.ts';
import SchedulePage from './pages/schedule-page/SchedulePage.tsx';
import CoursePage from './pages/OneCourse.tsx';
import PaymentPage from './pages/payment-page/PaymentPage.tsx';
import TestPage from './pages/test-page/TestPage.tsx';
import TestResultsPage from './pages/tests-result/TestResultsPage.tsx';
import StudentCoursePage from './pages/student-course-page/StudentCoursePage.tsx';
import CodePage from './pages/code-page/CodePage.tsx';
import TaskResultPage from './pages/task-result-page/TaskResultPage.tsx';
import LessonPage from './pages/lesson-page/LessonPage.tsx';
import CourseBuilder from './components/will_be_added/for-teacher/create-course/course-builder/CourseBuilder.tsx';
import TestCreatedPage from './components/will_be_added/for-teacher/add-test/page/TestCreatedPage.tsx';
import TestConstructorPage from './components/will_be_added/for-teacher/add-test/page/TestConstructorPage.tsx';
import TeacherCoursesPage from './components/will_be_added/for-teacher/add-test/page/TecherCoursesPage.tsx';
import CreatingCourse from './pages/creating-course/course-info/CreatingCourse.tsx';
import CreatingModule from './pages/creating-course/modules/CreatingModule.tsx';
import HomePage from './pages/home-page/HomePage.tsx';
import axios from 'axios';
import { RootState } from './store/store.ts';
import TeacherTaskResultsPage from './pages/teacher-tasks-result/TeacherTaskResultsPage.tsx';
import TeacherTestResultsPage from './pages/teacher-test-results/TeacherTestResultsPage.tsx';
// import TeacherDashboard from './components/will_be_added/for-teacher/teacher-dashboard/TeacherDashboard.tsx';


interface UserPayload extends JwtPayload {
    user_id: string
}

function App() {
  const dispatch = useDispatch();
  // const navigate = useNavigate()
  const is_authenticated = useSelector((state: RootState) => state.auth.is_authenticated);

  const getInitialUserInfo = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        console.log('Пользователь не авторизован!!!');
        dispatch(
          loginUser({
            user_id: null,
            is_authenticated: false,
            user_name: null,
            is_teacher: false,
          })
        );

        
        console.log(is_authenticated);
        return;
      }

      const decodedToken = jwtDecode<UserPayload>(token);
                  
      const userId = Number(decodedToken.user_id);

      const response = await axios.get(`http://localhost:8080/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const userData = response.data
      console.log(userData)
      

      dispatch(
        loginUser({
          user_id: userId,
          is_authenticated: true,
          user_name: userData.name,
          is_teacher: userData.is_teacher,
        })
      );
      
    } 
    catch (error) {
      console.error('Ошибка при получении информации о пользователе:', error);
      console.log('Пользователь не авторизован!!!');
      localStorage.removeItem('auth_token');
      dispatch(
        loginUser({
          user_id: null,
          is_authenticated: false,
          user_name: null,
          is_teacher: false,
        })
      );
      // window.location.href = '/login';
      console.log('Код после редиректа'); // Проверка, выполняется ли код после редиректа

    }
  }
  
  React.useEffect(() => {
    getInitialUserInfo();
  }, [is_authenticated])


  return (
    <>
      <Router basename="/">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/courses" element={<CourcesPage />} />
          <Route path="/teachers/1" element={<OneTeacherPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/coursepreview/:id" element={<CoursePage />} />
          <Route path="/payment/:id" element={<PaymentPage />} />
          <Route path="/test/:id" element={<TestPage />} />
          <Route path="/test/results/:id" element={<TestResultsPage />} />
          <Route path="/course/:id" element={<StudentCoursePage />} />

          <Route path="/task/:id" element={<CodePage />} />
          <Route path="/task/results/:id" element={<TaskResultPage />} />

          <Route path="/lesson/:id" element={<LessonPage />} />


          <Route path="/teacher" element={<CourseBuilder />} />
          <Route path="/module/:id/createtest" element={<TestConstructorPage />} />
          <Route path="/module/:id/createdtest/:testID" element={<TestCreatedPage />} />

        <Route path="/teacher/courses" element={<TeacherCoursesPage/>} />
        <Route path="/create/course" element={<CreatingCourse/>} />

        <Route path="/course/edit/:courseID" element={<CreatingModule/>} />

        <Route path="" element={<HomePage/>} />

        <Route path="/all/tasks/:taskId" element={<TeacherTaskResultsPage/>} />
        <Route path="/all/tests/:testId" element={<TeacherTestResultsPage/>} />


        </Routes>
      </Router>
    </>
  )
}

export default App
