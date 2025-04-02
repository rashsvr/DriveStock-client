import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthLayout from "../components/ui/AuthLayout";

function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer", // Default to buyer as requested
    name: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep = () => {
    let newErrors = {};
    if (currentStep === 1) {
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.phone) newErrors.phone = "Phone is required";
      else if (!/^\+?\d{9,15}$/.test(formData.phone)) newErrors.phone = "Phone is invalid";
    } else if (currentStep === 2) {
      if (!formData.password) newErrors.password = "Password is required";
      else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
      if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsLoading(false);
      setShowSuccess(true);
    }
  };

  // Handle step click
  const handleStepClick = (step) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        navigate("/Login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate]);

  const alertVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
  };

  return (
    <AuthLayout title="Register" isLoading={isLoading}>
      {/* Stepper - Made clickable */}
      <ul className="steps w-full mb-6">
        <li
          className={`step ${currentStep >= 1 ? "step-accent cursor-pointer" : "cursor-not-allowed"}`}
          data-content={currentStep > 1 ? "✓" : "1"}
          onClick={() => handleStepClick(1)}
        >
          User Details
        </li>
        <li
          className={`step ${currentStep >= 2 ? "step-accent cursor-pointer" : "cursor-not-allowed"}`}
          data-content={currentStep > 2 ? "✓" : "2"}
          onClick={() => handleStepClick(2)}
        >
          Password
        </li>
        <li
          className={`step ${currentStep >= 3 ? "step-accent cursor-pointer" : "cursor-not-allowed"}`}
          data-content="3"
          onClick={() => handleStepClick(3)}
        >
          Complete
        </li>
      </ul>

      {showSuccess && (
        <motion.div
          role="alert"
          className="alert alert-success"
          variants={alertVariants}
          initial="hidden"
          animate="visible"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Registration successful! Redirecting to login...</span>
        </motion.div>
      )}

      {!showSuccess && (
        <form className="space-y-4" onSubmit={handleNext}>
          {currentStep === 1 && (
            <>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="input input-bordered w-full"
                  required
                />
                {errors.email && <span className="text-error text-sm">{errors.email}</span>}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="input input-bordered w-full"
                  required
                />
                {errors.name && <span className="text-error text-sm">{errors.name}</span>}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone (e.g., +1234567890)"
                  className="input input-bordered w-full"
                  required
                />
                {errors.phone && <span className="text-error text-sm">{errors.phone}</span>}
              </div>
              {/* Role field is hidden but kept in formData with default "buyer" */}
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="input input-bordered w-full"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && <span className="text-error text-sm">{errors.password}</span>}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="input input-bordered w-full"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="text-error text-sm">{errors.confirmPassword}</span>
                )}
              </div>
            </>
          )}

          {currentStep === 3 && (
            <div className="space-y-2">
              <p>
                <strong>Email:</strong> {formData.email}
              </p>
              <p>
                <strong>Name:</strong> {formData.name}
              </p>
              <p>
                <strong>Phone:</strong> {formData.phone}
              </p>              
            </div>
          )}

          <div className="text-center">
            <button
              type="submit"
              className="btn bg-orange-500 text-white hover:bg-orange-600 w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Processing...
                </>
              ) : currentStep < 3 ? (
                "Next"
              ) : (
                "Register"
              )}
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}

export default Register;