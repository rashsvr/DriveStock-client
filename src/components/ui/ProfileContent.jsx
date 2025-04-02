// components/ProfileContent.jsx
import React from "react";

const ProfileContent = () => {
  // Sample user data (no password)
  const user = {
    email: "sampleseller@mail.com",
    role: "seller",
    name: "samseller",
    phone: "+94446546545",
  };

  return (
    <div className="bg-base-100 shadow-lg rounded-lg p-6 max-w-2xl mx-auto border border-orange-500/50 hover:border-orange-300 transition-all duration-300">
      <h2 className="text-2xl font-bold mb-4 text-base-content">Customer Profile</h2>
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

     
      </div>
    </div>
  );
};

export default ProfileContent;