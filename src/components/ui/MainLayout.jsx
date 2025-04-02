import React, { useState, useEffect } from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import FloatingSidebar from "./FloatingSidebar"; 
import LoadingAnimation from "../function/loadingAnimation";
import ProfilePage from "../../pages/ProfilePage";
import OrdersPage from "../../pages/OrdersPage";
import ProductsPage from "../../pages/ProductsPage";
import HomePage from "../../pages/HomePage"; 
import CheckoutPage from "../../pages/checkoutPage";
import Footer from "./Footer";
import LoginPage from "../../pages/LoginPage";
import Register from "../../pages/RegisterPage";

const MainLayout = () => {
  const location = useLocation();
  const [isNavLoading, setIsNavLoading] = useState(false);

  useEffect(() => {
    setIsNavLoading(true);
    const timer = setTimeout(() => {
      setIsNavLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Define paths where FloatingSidebar should be hidden
  const hideSidebarPaths = ["/Login", "/Register"];
  const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-base-100 text-base-content transition-colors duration-200">
      {isNavLoading && <LoadingAnimation />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/products" element={<ProductsPage />} /> 
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/Login" element={<LoginPage/>} />
        <Route path="/Register" element={<Register />} />
      </Routes>
      {shouldShowSidebar && <FloatingSidebar />}
      <ThemeToggle />
      <Footer/>
    </div>
  );
};

export default MainLayout;