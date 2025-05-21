import { FC, } from "react";
import './PaymentForm.css';
import { Payment } from "../../modules/payment";

interface PaymentFormProps {
    payment: Payment | null,
    onSubmit: (id: number) => void;
}

const PaymentForm: FC<PaymentFormProps> = ({payment, onSubmit}) => {


  return (
    <div className="payment-container">
      {/* <div className="payment-header">
        <h1 className="payment-header__title">Coding</h1>
        <p className="payment-header__subtitle">Онлайн-школа программирования</p>
      </div> */}
      {payment &&
      (
      <><div className="payment-profile-info">
        <h2 className="payment-section-title">Данные профиля</h2>
        <div className="payment-profile-info__content">
          <div className="payment-profile-info__name">{payment.student.surname} {payment.student.name}</div>
          <div className="payment-profile-info__email">{payment.student.email}</div>
        </div>
      </div>
      
      <div className="payment-course-info">
        <h2 className="payment-course-info__title">{payment.course.name}</h2>
        <p className="payment-course-info__description">{payment.course.description}</p>
        
        <div className="payment-course-details">
          {/* <div className="payment-course-details__duration">
            <p>Длительность: 12 недель</p>
            <p>Старт: 15 апреля 2025</p>
          </div> */}
          <div className="payment-course-details__price">0 у.е.</div>
        </div>
      </div>
      
      <button className="payment-button" onClick={() => onSubmit(payment.course.id)}>Оплатить 0 у.е.</button></>)
}
    </div>
  );
};

export default PaymentForm;