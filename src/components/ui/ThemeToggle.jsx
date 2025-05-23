// components/ThemeToggle.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [isHovered, setIsHovered] = useState(false); 

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setDarkMode(savedTheme ? savedTheme === "dark" : true);
  }, []);

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
      className={`fixed right-6 bottom-20 z-50 flex items-center justify-center rounded-xl   shadow-xl shadow-orange-500/20 ${
        darkMode ? "bg-highlight-orange" : "bg-dark-bluish-black  "
      }`}
      animate={{ 
        width: ['xs', 'sm'].includes(window.innerWidth < 640 ? 'xs' : 'sm') ? 56 : 64,
        height: ['xs', 'sm'].includes(window.innerWidth < 640 ? 'xs' : 'sm') ? 56 : 64,
        rotate: darkMode ? 180 : 0, 
        scale: isHovered ? 1.1 : 1 
      }}
      transition={{ duration: 0.3 }}
    >
      {darkMode ? (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8 text-white" 
          fill=" none" 
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
          className="h-8 w-8 text-highlight-orange " 
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