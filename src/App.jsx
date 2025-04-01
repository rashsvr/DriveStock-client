// App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import MainLayout from "./components/ui/MainLayout";
import LoadingAnimation from "./components/function/loadingAnimation";

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Set initial theme before rendering
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    // Default to dark if no saved theme
    const initialTheme = savedTheme || "dark";
    document.documentElement.setAttribute("data-theme", initialTheme);
    
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      {isInitialLoading ? <LoadingAnimation /> : <MainLayout />}
    </Router>
  );
}

export default App;