// SearchBar.jsx
import React, { useState, useEffect, useRef } from "react";

const SearchBar = ({ onSearch, initialSearch }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);

  const allSuggestions = [
    "Brake Pads",
    "Radiator",
    "Oil Filter",
    "Air Filter",
    "Spark Plugs",
    "Cooling System",
    "Braking System"
  ];

  useEffect(() => {
    setSearchTerm(initialSearch || "");
  }, [initialSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = allSuggestions
      .filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 3);
    setSuggestions(filtered);
  }, [searchTerm]);

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    onSearch(suggestion);
    setIsFocused(false);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
    setSuggestions([]);
    setIsFocused(false);
  };

  const handleSearchSubmit = () => {
    onSearch(searchTerm);
    setIsFocused(false);
  };

  return (
    <div className="relative w-full max-w-md mx-auto p-1" ref={wrapperRef}>
      <div className="join w-full relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyPress={(e) => e.key === "Enter" && handleSearchSubmit()}
          placeholder="Search products..."
          className="input input-bordered join-item w-full border-[#F97316]/30 focus:border-[#F97316] focus:outline-none pr-20"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-14 top-1/2 -translate-y-1/2 text-[#F97316] hover:text-[#F97316]/80 p-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        <button 
          onClick={handleSearchSubmit}
          className="btn join-item bg-[#F97316] hover:bg-[#F97316]/80 border-none text-white"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </button>
      </div>

      {isFocused && suggestions.length > 0 && (
        <div className="absolute left-6 right-6 mt-2 z-50">
          <ul className="menu bg-[#1A2526]/95 backdrop-blur-sm rounded-box shadow-xl border border-[#F97316]/30 p-2 w-full">
            {suggestions.map((suggestion, index) => (
              <li key={index}>
                <button
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-[#F97316] hover:bg-[#F97316]/20 hover:text-[#F97316]/80 transition-colors duration-200 w-full text-left py-2 px-4"
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;