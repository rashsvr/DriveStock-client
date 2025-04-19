import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/ui/AuthLayout";
import Alert from "../components/ui/Alert";
import api from "../services/api";

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setAlert(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.login(formData.email, formData.password);
      if (response.success) {
        // Check account status
        if (response.data.status !== "active") {
          throw {
            message: "Account is not active. Please contact support.",
            code: "INACTIVE_ACCOUNT",
            isBigError: true,
          };
        }
        // Proceed with successful login
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({ userId: response.data.userId }));
        navigate("/");
      } else {
        // Show API-provided message for success: false
        throw {
          message: response.message || "Login failed. Please try again.",
          isBigError: false,
        };
      }
    } catch (err) {
      const { message, code, isBigError } = err;
      if (isBigError) {
        navigate('/error', { state: { message, code } });
      } else {
        setAlert({ type: "error", message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Login" isLoading={isLoading}>
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
      <form className="space-y-4" onSubmit={handleSubmit}>
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
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="btn bg-orange-500 w-full text-white hover:bg-orange-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Register here
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;