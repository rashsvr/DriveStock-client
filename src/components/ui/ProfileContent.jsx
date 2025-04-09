import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; 
import api from "../../services/api";
import Alert from "./Alert";
  
const ProfileContent = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState(null); // For error/success messages
  const navigate = useNavigate();

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.getProfile();
        if (response.success) {
          setUser(response.data); // Set fetched user data
        } else {
          setAlert({ type: "error", message: "Failed to load profile data." });
        }
      } catch (err) {
        const { message, code, isBigError } = err;
        if (isBigError) {
          navigate("/error", { state: { message, code } }); // Redirect for big errors
        } else {
          setAlert({ type: "error", message: message || "Error fetching profile." });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Logout function
  const handleLogout = async () => {
    try {
      await api.logout(); // Call logout from api.js
      setAlert({ type: "success", message: "Logged out successfully!" });
      setTimeout(() => {
        navigate("/login"); // Redirect to login after a short delay
      }, 1000);
    } catch (err) {
      const { message, code, isBigError } = err;
      if (isBigError) {
        navigate("/error", { state: { message, code } });
      } else {
        setAlert({ type: "error", message: message || "Logout failed. Please try again." });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-6 text-base-content">
        <span className="loading loading-spinner text-orange-500"></span> Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-6 text-base-content">
        No profile data available.
      </div>
    );
  }

  return (
    <div className="bg-base-100 shadow-lg rounded-lg p-4 sm:p-6 max-w-2xl mx-auto border border-orange-500/50 hover:border-orange-300 transition-all duration-300">
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-base-content">
        {user.role === "seller" ? "Seller Profile" : "Customer Profile"}
      </h2>
      <div className="space-y-4">
        {/* Name */}
        <div className="flex justify-between items-center border-b border-base-300 pb-2">
          <span className="text-base-content/70 font-medium">Name</span>
          <span className="text-base-content">{user.name}</span>
        </div>

        {/* Email */}
        <div className="flex justify-between items-center border-b border-base-300 pb-2">
          <span className="text-base-content/70 font-medium">Email</span>
          <span className="text-base-content">{user.email}</span>
        </div>

        {/* Phone */}
        <div className="flex justify-between items-center border-b border-base-300 pb-2">
          <span className="text-base-content/70 font-medium">Phone</span>
          <span className="text-base-content">{user.phone}</span>
        </div>

        {/* Role */}
        <div className="flex justify-between items-center border-b border-base-300 pb-2">
          <span className="text-base-content/70 font-medium">Account Type</span>
          <span className="text-base-content capitalize">{user.role}</span>
        </div>

        {/* Log Out Button */}
        <div className="flex justify-end mt-6">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(249, 115, 22, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 
              bg-gradient-to-r from-[#F97316] to-[#6a6b6b] 
              text-white font-['Roboto'] font-bold text-sm sm:text-base md:text-lg 
              rounded-lg shadow-lg hover:shadow-xl 
              transition-all duration-300"
            onClick={handleLogout}
          >
            Log Out
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;