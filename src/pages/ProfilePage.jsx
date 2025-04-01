// pages/ProfilePage.jsx
import React, { useState } from "react";
import LoadingAnimation from "../components/function/loadingAnimation";
import Title from "../components/Title";

const ProfilePage = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
  };

  return (
    <div className="p-6">
      {isProcessing && <LoadingAnimation />}
   <Title text={"mfmdkm"}/>
    </div>
  );
};

export default ProfilePage;