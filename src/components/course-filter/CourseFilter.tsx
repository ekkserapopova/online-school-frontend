import { FC, useState } from "react";
import "./CourseFilter.css";
import { Language } from "../../modules/languages";

interface CourseFilterProps {
    languages?: Language[]; // Make languages an optional prop of Language type
    selectedLanguages: string[]; // Add selected languages prop
    setSelectedLanguages: (languages: string[]) => void; // Add setter for selected languages
}

const CourseFilter: FC<CourseFilterProps> = ({
    languages = [], // Default to empty array if not provided
    selectedLanguages,
    setSelectedLanguages
}) => {
    // Log the received languages prop for debugging
    console.log('Languages prop received:', languages);
    console.log('Type of languages:', typeof languages);
    console.log('Is Array:', Array.isArray(languages));
    
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    // Function to add/remove language from selected ones
    const toggleLanguage = (language: string) => {
        setSelectedLanguages(
            selectedLanguages.includes(language)
                ? selectedLanguages.filter(item => item !== language)
                : [...selectedLanguages, language]
        );
    };

    // Function for search
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // Filter languages by search query
    const filteredLanguages = Array.isArray(languages)
        ? languages
            .filter(lang => 
                lang && lang.name && lang.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(lang => lang.name)
        : [];

    return (
        <div className="course-filter">
            
            {/* Languages */}
            <div className="course-filter__name">Языки</div>
            <div className="dropdown">
                {/* Selected languages */}
                {selectedLanguages.length > 0 && (
                    <div className="dropdown__selected-languages">
                        {selectedLanguages.map((language, index) => (
                            <div key={index} className="dropdown__selected-languages__item">
                                {language}
                                <span
                                    className="remove-btn"
                                    onClick={() => toggleLanguage(language)}
                                >
                                    &#10005; {/* Cross for removal */}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Dropdown header with search field */}
                <div className="dropdown__header" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    {selectedLanguages.length > 0 ? "Выберите языки" : "Нет выбранных языков"}
                    <span className="dropdown__arrow">{isDropdownOpen ? "▲" : "▼"}</span>
                </div>

                {/* Dropdown content window, if it's open */}
                {isDropdownOpen && (
                    <div className="dropdown__content">
                        <input
                            type="text"
                            placeholder="Поиск..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="dropdown__content__search"
                        />
                        <ul className="dropdown__content__list">
                            {filteredLanguages.length > 0 ? (
                                filteredLanguages.map((language) => (
                                    <li key={language} className="dropdown__content__list__item">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={selectedLanguages.includes(language)}
                                                onChange={() => toggleLanguage(language)}
                                            />
                                            {language}
                                        </label>
                                    </li>
                                ))
                            ) : (
                                <li className="dropdown__content__list__item">Не найдено</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
            {/* Topics
            
            <div className="course-filter__topics">
            <div className="course-filter__name">Темы</div>
                <label className="course-filter__topics__label">
                    <input type="checkbox" checked={isWeb} onChange={() => setIsWeb(!isWeb)} /> 
                    <div className="course-filter__topics__checkbox-text">Веб-разработка</div> 
                </label>
                <label className="course-filter__topics__label">
                    <input type="checkbox" checked={isDevOps} onChange={() => setIsDevOps(!isDevOps)} /> 
                    <div className="course-filter__topics__checkbox-text">DevOps</div> 
                </label>
                <label className="course-filter__topics__label">
                    <input type="checkbox" checked={isML} onChange={() => setIsML(!isML)} /> 
                    <div className="course-filter__topics__checkbox-text">Машинное обучение</div> 
                </label>
                <label className="course-filter__topics__label">
                    <input type="checkbox" checked={isAnalytics} onChange={() => setIsAnalytics(!isAnalytics)} /> 
                    <div className="course-filter__topics__checkbox-text">Аналитика</div> 
                </label>
                <label className="course-filter__topics__label">
                    <input type="checkbox" checked={isBackend} onChange={() => setIsBackend(!isBackend)} /> 
                    <div className="course-filter__topics__checkbox-text">Бэкенд</div> 
                </label>
                <label className="course-filter__topics__label">
                    <input type="checkbox" checked={isFrontend} onChange={() => setIsFrontend(!isFrontend)} /> 
                    <div className="course-filter__topics__checkbox-text">Фронтенд</div> 
                </label>
            </div>*/}
        </div> 
    );
};

export default CourseFilter;