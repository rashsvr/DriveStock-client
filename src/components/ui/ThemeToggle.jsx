// components/ThemeToggle.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode
  const [isHovered, setIsHovered] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    // If there's a saved theme, use it; otherwise, use dark (true)
    setDarkMode(savedTheme ? savedTheme === "dark" : true);
  }, []);

  // Update theme when darkMode changes
  useEffect(() => {
    const theme = darkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [darkMode]);

  const handleToggle = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <motion.button
      onClick={handleToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed right-6 bottom-20 z-50 flex h-14 w-14 items-center justify-center rounded-lg bg-dark-bluish-black border-2 border-orange-400 shadow-lg shadow-orange-400/20"
      animate={{ rotate: darkMode ? 180 : 0, scale: isHovered ? 1.2 : 1.1 }}
      transition={{ duration: 0.3 }}
    >
      {darkMode ? (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-7 w-7 text-orange-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth="1.5"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-7 w-7 text-orange-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth="1.5"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </motion.button>
  );
};

export default ThemeToggle;
