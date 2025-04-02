// pages/LoginPage.jsx
import React, { useState } from "react";
import AuthLayout from "../components/ui/AuthLayout";

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
    setIsLoading(false);
    console.log("Login submitted:", formData); // Replace with actual login logic
  };

  return (
    <AuthLayout title="Login" isLoading={isLoading}>
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
            className="btn bg-orange-500 w-full"
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
      </form>
    </AuthLayout>
  );
}

export default LoginPage;