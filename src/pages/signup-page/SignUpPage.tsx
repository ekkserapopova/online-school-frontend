import { FC, useState } from "react";
import SignUp from '../../components/signup/SignUp'
import Navibar from "../../components/navbar/Navibar";
import api from "../../modules/login";
import { jwtDecode } from "jwt-decode";
import { loginUser } from "../../store/slices/authSlice";
import { UserPayload } from "../login-page/LoginPage";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

export function convertDateFormat(dateStr: string): string {
    // Парсим строку даты в объект Date
    const date = new Date(dateStr);
    
    // Преобразуем в формат ISO (2006-01-02T15:04:05Z07:00)
    return date.toISOString();
}
  

const SignupPage:FC = () =>{
    // const [id, setId] = useState<number>(10)
    const [valueName, setvalueName] = useState('')
    const [valueSurname, setvalueSurname] = useState('')
    const [valueBirth, setvalueBirth] = useState('')
    const [valuePhone, setvaluePhone] = useState('')
    const [valueRole, setvalueRole] = useState('')
    const [valuePassword, setvaluePassword] = useState('')
    const [valueEmail, setvalueEmail] = useState('')
    const navigation = useNavigate()
    const dispatch = useDispatch()



    const signUp = async() =>{
        try{
            const birthDate = convertDateFormat(valueBirth)
            const response = await api.post("/signup",
                {
                    name: valueName,
                    surname: valueSurname,
                    birth: birthDate,
                    email:valueEmail,
                    phone: valuePhone,
                    password: valuePassword,
                    role: valueRole
                }
            )
            const userData = response.data;
                        
                        
            const token = userData["token"]
            localStorage.setItem('auth_token', token);
            
            const decodedToken = jwtDecode<UserPayload>(token);
                        
                        
            const userId = Number(decodedToken.user_id);
            console.log(userId)
            
            
                        
            dispatch(loginUser(
                {user_id: userId,
                is_authenticated: true,
                is_teacher: false}
            ))


            navigation('/courses')

        } catch{

        }
    }
    
    return(
        <>
            <Navibar/>
            <SignUp valueName={valueName}
                    valueSurname={valueSurname}
                    valuePhone={valuePhone}
                    valueBirth={valueBirth}
                    valueRole={valueRole}
                    valueEmail={valueEmail}
                    valuePassword={valuePassword}
                    setvalueEmail={(valueEmail)=>setvalueEmail(valueEmail)}
                    setvaluePassword={(valuePassword) => setvaluePassword(valuePassword)}
                    setvalueName={(valueName) => setvalueName(valueName)}
                    setvalueSurname={(valueSurame) => setvalueSurname(valueSurame)}
                    setvalueBirth={(valueBirth) => setvalueBirth(valueBirth)}
                    setvaluePhone={(valuePhone) => setvaluePhone(valuePhone)}
                    setvalueRole={(valueRole) => setvalueRole(valueRole)}
                    onClickignUp={signUp}
                    />
        </>
    )
}

export default SignupPage

function dispatch(arg0: any) {
    throw new Error("Function not implemented.");
}
