// components/SearchBar.jsx
import React, { useState, useEffect, useRef } from "react";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);

  // Sample suggestion data
  const allSuggestions = [
    "Profile Settings",
    "Order History",
    "Product Catalog",
    "User Preferences",
    "Payment Methods",
    "Shipping Details",
    "Account Overview",
  ];

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update suggestions based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = allSuggestions
      .filter(item => 
        item.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 3);
    setSuggestions(filtered);
  }, [searchTerm]);

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setIsFocused(false);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSuggestions([]);
    setIsFocused(false);
  };

  return (
    <div className="relative w-full max-w-md mx-auto p-1" ref={wrapperRef}>
      {/* Search Input with Clear Button */}
      <div className="join w-full relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search..."
          className="input input-bordered join-item w-full    border-orange-500/30 focus:border-orange-500 focus:outline-none pr-20"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-14 top-1/2 -translate-y-1/2 text-orange-400 hover:text-orange-300 p-2"
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
        <button className="btn btn-primary join-item bg-orange-500 hover:bg-orange-600 border-none">
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

      {/* Floating Suggestions aligned with input */}
      {isFocused && suggestions.length > 0 && (
        <div className="absolute left-6 right-6 mt-2 z-50">
          <ul className="menu bg-dark-bluish-black/95 backdrop-blur-sm rounded-box shadow-xl border border-orange-500/30 p-2 w-full">
            {suggestions.map((suggestion, index) => (
              <li key={index}>
                <button
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-orange-300 hover:bg-orange-500/20 hover:text-orange-200 transition-colors duration-200 w-full text-left py-2 px-4"
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