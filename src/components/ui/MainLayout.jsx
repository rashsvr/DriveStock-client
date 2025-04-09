import React, { useState, useEffect } from "react";
import { useLocation, Routes, Route, matchPath, useNavigate } from "react-router-dom";
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
import { isAuthenticated } from "../../services/api"; // Adjust import path as needed

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNavLoading, setIsNavLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Protected routes requiring authentication
  const protectedRoutes = ["/orders", "/checkout"];

  useEffect(() => {
    setIsNavLoading(true);
    const timer = setTimeout(() => {
      setIsNavLoading(false);
    }, 1000);

    if (protectedRoutes.some(path => matchPath(path, location.pathname))) {
      if (!isAuthenticated()) {
        setShowLoginModal(true);
      }
    }

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const hideSidebarPaths = ["/login", "/register"];
  const isErrorPage = !["/", "/orders", "/products", "/checkout", "/login", "/register"].some(path =>
    matchPath(path, location.pathname)
  );
  const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname) && !isErrorPage;

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    navigate("/login");
  };

  const handleModalClose = () => {
    setShowLoginModal(false);
    navigate("/"); // Redirect to home if they close without logging in
  };

  // Callback to trigger modal from FloatingSidebar
  const handleCartClick = () => {
    if (!isAuthenticated()) {
      setShowLoginModal(true);
      return false; // Indicate cart should not open
    }
    return true; // Indicate cart can open
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content transition-colors duration-200">
      {isNavLoading && <LoadingAnimation />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/orders" element={isAuthenticated() ? <OrdersPage /> : <HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/checkout" element={isAuthenticated() ? <CheckoutPage /> : <HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<ErrorPage message="Oops! Page not found." code={404} />} />
      </Routes>

      {shouldShowSidebar && <FloatingSidebar onCartClick={handleCartClick} />}
      <ThemeToggle />
      <Footer />

      {/* Modal for login prompt */}
      {showLoginModal && (
        <>
          <input type="checkbox" id="login_modal" className="modal-toggle" checked readOnly />
          <div className="modal" role="dialog">
            <div className="modal-box bg-gray-900 border border-orange-500 shadow-xl w-11/12 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-orange-500 text-white rounded-full p-2">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-orange-400 mb-1">
                    Login Required
                  </h3>
                  <p className="text-sm text-gray-300">
                    Please log in to access this page and shop here.
                  </p>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-200 transition text-xl"
                  onClick={handleModalClose}
                >
                  ✕
                </button>
              </div>
              <div className="modal-action justify-end gap-3 mt-6">
                <button
                  className="btn bg-orange-500 hover:bg-orange-600 border-none text-white font-semibold px-4 py-2 rounded-md"
                  onClick={handleLoginRedirect}
                >
                  Go to Login
                </button>
                <button
                  className="btn bg-transparent border border-gray-600 hover:bg-gray-800 text-gray-300 font-medium px-4 py-2 rounded-md"
                  onClick={handleModalClose}
                >
                  Cancel
                </button>
              </div>
            </div>
            <label htmlFor="login_modal" className="modal-backdrop" onClick={handleModalClose}></label>
          </div>
        </>
      )}
    </div>
  );
};

export default MainLayout;