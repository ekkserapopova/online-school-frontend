import { FC, useEffect, useState } from "react";
import PaymentForm from "../../components/payment-form/PaymentForm";
import Navibar from "../../components/navbar/Navibar";
import api from "../../modules/login";
import { Payment } from "../../modules/payment";
import { useNavigate } from "react-router-dom";

const PaymentPage:FC = () => {
    const courseId = Number(window.location.pathname.split('/').pop())
    const [payment, setPayment] = useState<Payment | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const navigate = useNavigate();
    
    const getPayment = async (courseID:number) => {
        try {
            const response = await api.get(`/payment/course/${courseID}`);
            const paymentData = response.data.payment;
            setPayment(paymentData);
            setIsLoading(false);
        } catch(error) {
            // Проверяем, был ли уже создан платеж
            if (!payment) {
                addPayment(courseID);
            } else {
                setIsLoading(false);
            }
        }
    }

    const addPayment = async(courseID:number) => {
        try{
            const response = await api.post(`/payment/course/${courseID}`)
            const paymentData = response.data.payment
            setPayment(paymentData)
            console.log(paymentData)
            setTimeout(() => getPayment(courseID), 500);

        } catch(error){
            console.log("Не удалось произвести запись оплаты")
            
            setIsLoading(false);
        }
    }

    const enrollToCourse = async (courseID:number) => {
        try{
            const response = await api.post(`/courses/${courseID}/enroll`);
            const enrollData = response.data.enroll;
            console.log(enrollData);
            navigate('/schedule')
        } catch(error){
            console.error('Ошибка записи на курс:', error);
        }
    }

    const putPayingStatus = async (courseID:number) => {
        try{
            const response = await api.put(`/payment/course/${courseID}`, { status: 'paid' });
            const paymentData = response.data.payment;
            setPayment(paymentData);
            console.log(paymentData);
            enrollToCourse(courseID);
        } catch(error){ 
            console.error('Ошибка обновления статуса платежа:', error);
        }
    }

    useEffect(() => {
        try {
            console.log('useEffect ЗАПУСТИЛСЯ, courseId:', courseId);
            getPayment(courseId);
            
          } catch (err) {
            console.error('Ошибка в useEffect:', err);
            setIsLoading(false);
          }
    }, []);

    // useEffect(() => {
    //     if (payment) {
    //         setIsLoading(false);
    //     }
    // }, [payment]);
    
    return(
        <>
            <Navibar/>
            {isLoading ? (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '50vh',
                    textAlign: 'center',
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    margin: '20px auto',
                    maxWidth: '600px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                }}>
                    <div className="spinner" style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid rgba(0, 0, 0, 0.1)',
                        borderRadius: '50%',
                        borderTop: '3px solid #3498db',
                        animation: 'spin 1s linear infinite',
                        marginBottom: '20px'
                    }}></div>
                    <div style={{ fontSize: '18px', fontWeight: 500, color: '#333' }}>
                        Загрузка...
                    </div>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            ) : payment ? (
                <PaymentForm payment={payment} onSubmit={putPayingStatus}/>
            ) : (
                <div>Платеж создан. Загружаем информацию...</div>
            )}
        </>
    )
}

export default PaymentPage