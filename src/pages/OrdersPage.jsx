// pages/OrdersPage.jsx
import React, { useState } from "react";
import LoadingAnimation from "../components/function/loadingAnimation";

const OrdersPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
  };

  return (
    <div className="p-6">
      {isProcessing && <LoadingAnimation />}
      <h1 className="text-2xl text-orange-500 mb-4">Orders Page</h1>
      <button 
        onClick={handleProcess}
        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
      >
        Refresh Orders
      </button>
    </div>
  );
};

export default OrdersPage;