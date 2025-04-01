import React from "react";

const IconButton = ({ icon }) => {
  return (
    <button className="w-5 h-5 flex items-center justify-center bg-white text-dark-bluish-black rounded-full shadow-md hover:bg-highlight-orange transition">
      {icon}
    </button>
  );
};

export default IconButton;
