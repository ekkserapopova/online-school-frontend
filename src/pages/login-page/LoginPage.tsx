import { FC, useState } from "react";
import LogIn from '../../components/login/LogIn'
import Navibar from "../../components/navbar/Navibar";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../modules/login";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/slices/authSlice";
import {jwtDecode, JwtPayload} from 'jwt-decode'

export interface UserPayload extends JwtPayload {
    user_id: string
}


const LoginPage:FC = () =>{
    // const [id, setId] = useState<number>(10)
    const [valuePassword, setvaluePassword] = useState('')
    const [valueEmail, setvalueEmail] = useState('')
    const dispatch = useDispatch()
    const navigation = useNavigate()

    const login = async () => {
        try {
            const response = await api.post('/login', {
                email: valueEmail,
                password: valuePassword,
            });
            // console.log(response)
            const userData = response.data;
            console.log(userData)
            
            const token = userData["token"]
            localStorage.setItem('auth_token', token);

            const decodedToken = jwtDecode<UserPayload>(token);
            
            
            const userId = Number(decodedToken.user_id);
            console.log(userId)


            
            dispatch(loginUser(
                {
                    user_id: userId,
                    is_authenticated: true,
                    user_name: userData.name
                }
            ))
            navigation('/courses')
            } catch (error) {
                // toast.error("Неверный логин или пароль")
                console.error('Ошибка при авторизации:', error);
            }
            
      };
    
    return(
        <>
            <Navibar />
            <LogIn valueEmail={valueEmail}
                    valuePassword={valuePassword}
                    setvalueEmail={(valueEmail)=>setvalueEmail(valueEmail)}
                    setvaluePassword={(valuePassword) => setvaluePassword(valuePassword)}
                    onSubmit={login}/>
        </>
    )
}

export default LoginPage