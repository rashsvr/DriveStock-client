// pages/ProfilePage.jsx
import React, { useState } from "react";
import LoadingAnimation from "../components/function/loadingAnimation";
import SubLayout from "../components/ui/SubLayout";

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
      <SubLayout title={"Profile"}>

</SubLayout>
    </div>
  );
};

export default ProfilePage;