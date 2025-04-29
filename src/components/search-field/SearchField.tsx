import { FC } from "react"
import "./SearchField.css"

interface SearchFialdProps {
  valueSearch: string
  setvalueSearch: (valueSearch: string) => void
  onSubmit?: (value: string) => void
}

const SearchField: FC<SearchFialdProps> = ({ valueSearch, setvalueSearch, onSubmit }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(valueSearch);
    }
  }

  return (
    <>
      <form className="search-field" onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-name-input"
          value={valueSearch}
          onChange={(event) => setvalueSearch(event.target.value)}
          placeholder="Поиск..."
        />
        <button 
          type="submit" 
          className="search-name-button" 
          aria-label="Найти">
        </button>
      </form>
    </>
  )
}

export default SearchField