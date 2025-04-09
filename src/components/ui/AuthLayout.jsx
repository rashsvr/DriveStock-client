// components/ui/AuthLayout.jsx
import React from "react";
import ThemeToggle from "./ThemeToggle";
import LoadingAnimation from "../function/loadingAnimation";
import Footer from "./Footer";

function AuthLayout({ title, children, isLoading = false }) {
  return (
    <div className="min-h-screen  bg-gradient-to-br from-orange-500 from-30% via-dark-bluish-black via-65%  to-dark-bluish-black via-25% text-base-content transition-colors duration-200 flex flex-col">
      {isLoading && <LoadingAnimation />}
      <div className="flex-grow flex items-center justify-center py-12">
        <div className="card w-full max-w-md bg-base-200 shadow-xl">
          <div className="card-body">
            <h1 className="text-3xl font-bold text-center mb-6">{title}</h1>
            {children} {/* Form fields or other content */}
          </div>
        </div>
      </div>
      <div className="mt-auto">
       
      </div>
    </div>
  );
}

export default AuthLayout;