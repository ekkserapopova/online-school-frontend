import { FC } from "react"
import "./TeacherCard.css"
import { Teacher } from "../../pages/teachers-page/TeachersPage"



const TeacherCard:FC<Teacher> = ({name, surname, description}) =>{
    return (
        <>
            <div className="teacher-card-container">
                <img src="../../image.png" alt="" className="teacher-card-photo" width={248} height={248}/>
                <div className="teaacher-card-name">{name} {surname}</div>
                <div className="teacher-card-overview">{description}</div>
                <div className="teacher-card-langs">
                    <div className="teacher-card-langs-name"></div>
                    <div className="teacher-card-langs-list">
                        <div className="teacher-card-lang">Python</div>
                        <div className="teacher-card-lang">Go</div>
                        <div className="teacher-card-lang">Typescript</div>
                        {/* <div className="teacher-card-lang">Javascript</div> */}
                        {/* <li className="teacher-card-lang">и др</li> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default TeacherCard