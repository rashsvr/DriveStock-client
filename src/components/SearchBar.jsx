import { useState } from "react";
import { searchSuggestions } from "../data/data";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    setFilteredSuggestions(
      value
        ? searchSuggestions.filter((s) =>
            s.toLowerCase().includes(value.toLowerCase())
          )
        : []
    );
    onSearch(value); // Pass the search query to the parent
  };

  const handleSelectSuggestion = (suggestion) => {
    setQuery(suggestion);
    setFilteredSuggestions([]);
    onSearch(suggestion); // Pass the selected suggestion to the parent
  };

  return (
    <div className="relative w-80">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleSearch}
        className="w-full p-2 border rounded-lg"
      />
      {filteredSuggestions.length > 0 && (
        <div className="absolute top-12 left-0 bg-white shadow-lg rounded-md w-full max-h-40 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
