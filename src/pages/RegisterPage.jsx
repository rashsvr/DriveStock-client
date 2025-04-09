import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthLayout from "../components/ui/AuthLayout";
import Alert from "../components/ui/Alert"; // Import the new Alert component
import api from "../services/api";

function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer",
    name: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null); // State for showing alerts
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setAlert(null); // Clear alert on input change
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
    if (!validateStep()) {
      setAlert({ type: "error", message: "Please correct the errors in the form." });
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsLoading(true);
      try {
        const response = await api.register({
          email: formData.email,
          password: formData.password,
          role: formData.role,
          name: formData.name,
          phone: formData.phone,
        });
        if (response.success) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify({ userId: response.data.userId }));
          setShowSuccess(true);
        }
      } catch (err) {
        const { message, code, isBigError } = err;
        if (isBigError) {
          navigate('/error', { state: { message, code } }); // Redirect for big errors
        } else {
          setAlert({ type: "error", message }); // Show alert for small errors
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStepClick = (step) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate]);

  return (
    <AuthLayout title="Register" isLoading={isLoading}>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
      {showSuccess && (
        <Alert type="success" message="Registration successful! Redirecting to home..." />
      )}
      {!showSuccess && (
        <>
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
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>
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
        </>
      )}
    </AuthLayout>
  );
}

export default Register;