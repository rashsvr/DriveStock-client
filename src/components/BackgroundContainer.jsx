import React from "react";
const BackgroundContainer = ({ children }) => {
    return (
      <div className="bg-dark-bluish-black min-h-screen flex items-center justify-center p-4">
      <div className="  w-[95vw] h-[95vh] sm:w-[80vw] bg-dark-bluish-black rounded-2xl p-4 relative overflow-hidden m-5">
      {children}
    </div>
      </div>
    );
  };
  
  export default BackgroundContainer;
  