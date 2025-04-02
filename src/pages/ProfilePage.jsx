// pages/ProfilePage.jsx
import React, { useState } from "react";
import LoadingAnimation from "../components/function/loadingAnimation";
import SubLayout from "../components/ui/SubLayout"; 
import ProfileContent from "../components/ui/ProfileContent";

const ProfilePage = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="p-6">
      {isProcessing && <LoadingAnimation />}
      <SubLayout title="Profile">
        <ProfileContent />
      </SubLayout>
    </div>
  );
};

export default ProfilePage;