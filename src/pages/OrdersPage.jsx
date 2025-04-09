// pages/OrdersPage.jsx
import React, { useState } from "react";
import LoadingAnimation from "../components/function/loadingAnimation";
import SubLayout from "../components/ui/SubLayout"; 
import OrderHistoryGrid from "../components/ui/OrderHistoryGrid";

const OrdersPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLoadMore = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
  };

  return (
    <div className=" py-6   px-16">
      {isProcessing && <LoadingAnimation />}
      <SubLayout
        title="OrderHistory"
        showLoadMore={true}
        onLoadMore={handleLoadMore}
        isLoading={isProcessing}
      >
        <OrderHistoryGrid />
      </SubLayout>
    </div>
  );
};

export default OrdersPage;