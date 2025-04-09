import React, { useState, useEffect } from "react";
import { useLocation, Routes, Route, matchPath } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import FloatingSidebar from "./FloatingSidebar";
import LoadingAnimation from "../function/loadingAnimation";
import OrdersPage from "../../pages/OrdersPage";
import ProductsPage from "../../pages/ProductsPage";
import HomePage from "../../pages/HomePage";
import CheckoutPage from "../../pages/checkoutPage";
import Footer from "./Footer";
import LoginPage from "../../pages/LoginPage";
import Register from "../../pages/RegisterPage";
import ErrorPage from "./ErrorPage";

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
  const hideSidebarPaths = ["/login", "/register"];
  const isErrorPage = !["/", "/orders", "/products", "/checkout", "/login", "/register"].some(path =>
    matchPath(path, location.pathname)
  );
  const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname) && !isErrorPage;

  return (
    <div className="min-h-screen bg-base-100 text-base-content transition-colors duration-200">
      {isNavLoading && <LoadingAnimation />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        {/* Catch-all route for unmatched paths */}
        <Route path="*" element={<ErrorPage message="Oops! Page not found." code={404} />} />
      </Routes>

      {shouldShowSidebar && <FloatingSidebar />}
      <ThemeToggle />
      <Footer />
    </div>
  );
};

export default MainLayout;
