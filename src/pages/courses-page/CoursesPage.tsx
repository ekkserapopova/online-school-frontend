import { FC, useState, useEffect } from "react";
import Navibar from "../../components/navbar/Navibar";
import Course from "../../components/course/Course";
import CourseFilter from "../../components/course-filter/CourseFilter";
import "./CoursesPage.css";
import SearchField from "../../components/search-field/SearchField";
import { Language, mockLangs } from "../../modules/languages";
import { mockCourses, OneCourse } from "../../modules/courses";
import api from "../../modules/login";
import { useNavigate } from "react-router-dom";

const CoursesPage: FC = () => {
    const [isWeb, setIsWeb] = useState(false);
    const [isAnalytics, setIsAnalytics] = useState(false);
    const [isBackend, setIsBackend] = useState(false);
    const [isDevOps, setIsDevOps] = useState(false);
    const [isFrontend, setIsFrontend] = useState(false);
    const [isML, setIsML] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchLangValue, setSearchLangValue] = useState('');
    const [langs, setLangs] = useState<Language[]>([]);
    const [courses, setCourses] = useState<OneCourse[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]); 

   const navigate = useNavigate();
    
    
    useEffect(() => {
        fetchCourses(searchValue);
        fetchLanguages(searchLangValue);
    }, []);
    

    const fetchCourses = async (name: string) => {
        try {
          console.log('Загрузка курсов');
          const response = await api.get('/courses', {
            params: { name }
          });
          console.log('API:', response);
          setCourses(response.data.courses);
        } catch (error) {
          console.error('Ошибка при загрузке курсов:', error);
          setCourses(mockCourses);
        }
      };

    const fetchLanguages = async (name: string) => {
        try {
            console.log('Загрузка языков');
            const response = await api.get('/languages', {
                params: { name }
              });
            console.log('Ответ API:', response);
            setLangs(response.data.languages);
        } catch (error) {
            console.error('Ошибка при загрузке языков:', error);
            setLangs(mockLangs);
        }
    };

    const getCourse  = async (id: number) => {
        try {
            const response = await api.get(`/courses/${id}`);
            const courseData = response.data.course;
            console.log(courseData);
            navigate(`/coursepreview/${id}`);

        } catch {
            console.error('Ошибка получения курса');
        }
    }
    
    return (
        <>
            <Navibar />
            <div className="courses-page-container">
                <CourseFilter
                    isWeb={isWeb}
                    isAnalytics={isAnalytics}
                    isBackend={isBackend}
                    isDevOps={isDevOps}
                    isFrontend={isFrontend}
                    isML={isML}
                    languages={langs} 
                    selectedLanguages={selectedLanguages} 
                    setIsWeb={setIsWeb}
                    setIsAnalytics={setIsAnalytics}
                    setIsBackend={setIsBackend}
                    setIsDevOps={setIsDevOps}
                    setIsFrontend={setIsFrontend}
                    setIsML={setIsML}
                    setSelectedLanguages={setSelectedLanguages} 
                />
                <div className="courses">
                    <SearchField
                        valueSearch={searchValue}
                        setvalueSearch={setSearchValue}
                        onSubmit={fetchCourses}
                    />
                    {/* <Course />
                    <Course />
                    <Course />
                    <Course />
                    <Course />
                    <Course /> */}
                    {courses?.map((item, id) => (
                        <Course course={item} onSubmit={() => getCourse(item.id)} />
                ))}
                </div>
            </div>
        </>
    );
};

export default CoursesPage;