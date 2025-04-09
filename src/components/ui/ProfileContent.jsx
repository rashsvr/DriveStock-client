import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProfileContent = () => {
  const navigate = useNavigate();

  // Sample user data (no password)
  const user = {
    email: "sampleseller@mail.com",
    role: "seller",
    name: "samseller",
    phone: "+94446546545",
  };

  // logout function
  const handleLogout = () => {
    console.log("User logged out");
    // Add any logout logic here (e.g., clear auth token, localStorage, etc.)
    // localStorage.removeItem("authToken"); // Example: clear auth token
    navigate("/login"); // Navigate to /login and replace current history entry
  };

  return (
    <div className="bg-base-100 shadow-lg rounded-lg p-6 max-w-2xl mx-auto border border-orange-500/50 hover:border-orange-300 transition-all duration-300">
      <h2 className="text-2xl font-bold mb-4 text-base-content">
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