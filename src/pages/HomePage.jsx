// pages/HomePage.jsx (renamed from ProfilePage)
import React, { useState } from "react";
import LoadingAnimation from "../components/function/loadingAnimation";
import SubLayout from "../components/ui/SubLayout";
import Title from "../components/Title";

const HomePage = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
  };

  return (
    <div className="p-6">
      {isProcessing && <LoadingAnimation />} 

      <div className="grid grid-cols-12 grid-rows-9 gap-0">
                <div className="col-span-2 col-start-2 row-start-2"><Title text={"DriveStockDummyHomePage"} /></div>
                
            </div>
    </div>
  );
};

export default HomePage;