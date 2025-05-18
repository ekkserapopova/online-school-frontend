import { FC, useState, useEffect } from "react";
import Navibar from "../../components/navbar/Navibar";
import Course from "../../components/course/Course";
import CourseFilter from "../../components/course-filter/CourseFilter";
import "./CoursesPage.css";
import SearchField from "../../components/search-field/SearchField";
import { Language, mockLangs } from "../../modules/languages";
import { mockCourses, OneCourse } from "../../modules/courses";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import axios from "axios";

const CoursesPage: FC = () => {
    const [searchValue, setSearchValue] = useState('');
    const [searchLangValue, setSearchLangValue] = useState('');
    const [langs, setLangs] = useState<Language[]>([]);
    const [courses, setCourses] = useState<OneCourse[]>([]);
    const [allCourses, setAllCourses] = useState<OneCourse[]>([]); // Для хранения всех курсов
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

    const navigate = useNavigate();
    const is_teacher = useSelector((state: RootState) => state.auth.is_teacher);
    
    
    useEffect(() => {
        fetchCourses(searchValue);
        fetchLanguages(searchLangValue);
        console.log('Teacher', is_teacher);
    }, []);

    useEffect(() => {
        if (selectedLanguages.length === 0) {
            // Если языки не выбраны, показываем все курсы
            setCourses(allCourses);
        } else {
            // Добавим отладочную информацию
            console.log('Выбранные языки:', selectedLanguages);
            console.log('Все курсы:', allCourses);
            
            // Фильтруем курсы по выбранным языкам
            const filteredCourses = allCourses.filter(course => {
                // Проверяем наличие свойства languages
                if (!course.languages || !Array.isArray(course.languages)) {
                    console.log('У курса отсутствуют языки:', course);
                    return false;
                }
                
                // Проверяем, есть ли у курса языки из выбранных
                const hasSelectedLanguage = course.languages.some(lang => {
                    // Проверяем структуру объекта языка
                    if (typeof lang === 'object' && lang !== null) {
                        return selectedLanguages.includes(lang.name);
                    } else if (typeof lang === 'string') {
                        return selectedLanguages.includes(lang);
                    }
                    return false;
                });
                
                console.log(`Курс ${course.name} ${hasSelectedLanguage ? 'прошел' : 'не прошел'} фильтр`);
                return hasSelectedLanguage;
            });
            
            console.log('Отфильтрованные курсы:', filteredCourses);
            setCourses(filteredCourses);
        }
    }, [selectedLanguages, allCourses]);
    

    const fetchCourses = async (name: string) => {
        try {
            console.log('Загрузка курсов');
            const authToken = localStorage.getItem('auth_token');
            const response = await axios.get('http://localhost:8080/api/courses', {
                params: { name },
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('API:', response);
            setAllCourses(response.data.courses); // Сохраняем все курсы
            setCourses(response.data.courses);    // Инициализируем отфильтрованные курсы
        } catch (error) {
            console.error('Ошибка при загрузке курсов:', error);
            setAllCourses(mockCourses);
            setCourses(mockCourses);
        }
    };

    const fetchLanguages = async (name: string) => {
        try {
            console.log('Загрузка языков');
            const authToken = localStorage.getItem('auth_token');
            const response = await axios.get('http://localhost:8080/api/languages', {
                params: { name },
                headers: { Authorization: `Bearer ${authToken}` }
            });
            console.log('Ответ API:', response);
            setLangs(response.data.languages);
        } catch (error) {
            console.error('Ошибка при загрузке языков:', error);
            setLangs(mockLangs);
        }
    };

    const getCourse = async (id: number) => {
        try {
            const authToken = localStorage.getItem('auth_token');
            const response = await axios.get(`http://localhost:8080/api/courses/${id}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            const courseData = response.data.course;
            console.log(courseData);
            navigate(`/coursepreview/${id}`);
        } catch {
            console.error('Ошибка получения курса');
        }
    }

   

    // Обработчик для поиска по названию
    const handleSearch = (searchQuery: string) => {
        setSearchValue(searchQuery);
        fetchCourses(searchQuery);
    };
    
    return (
        <>
            <Navibar />
            <div className="courses-page-container">
                <div className="courses-page__filters">
                    <SearchField
                        valueSearch={searchValue}
                        setvalueSearch={setSearchValue}
                        onSubmit={handleSearch}
                    />
                    {/* <CourseFilter
                        languages={langs} 
                        selectedLanguages={selectedLanguages} 
                        setSelectedLanguages={setSelectedLanguages} 
                    /> */}
                </div>
                <div className="courses">
                    {courses && courses.length > 0 ? (
                        courses.map((item, id) => (
                            <Course key={item.id} course={item} onSubmit={() => getCourse(item.id)} />
                        ))
                    ) : (
                        <div className="no-courses-found">
                            Курсы не найдены. Пожалуйста, измените параметры фильтрации.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CoursesPage;