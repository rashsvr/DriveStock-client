import React, { useState, useEffect } from "react";
import LoadingAnimation from "../components/function/loadingAnimation";
import SubLayout from "../components/ui/SubLayout";
import OrderHistoryGrid from "../components/ui/OrderHistoryGrid";
import api from "../services/api";

const OrdersPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async (pageNum) => {
    setIsProcessing(true);
    try {
      const response = await api.getOrderHistory({ page: pageNum, limit: 5 });
      const newOrders = response.data || [];
      setOrders((prev) => (pageNum === 1 ? newOrders : [...prev, ...newOrders]));
      setHasMore(newOrders.length === 5);
    } catch (err) {
      setError(err.message || "Failed to load order history.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchOrders(nextPage);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      {isProcessing && <LoadingAnimation />}
      <SubLayout
        title="Order History"
        showLoadMore={hasMore}
        onLoadMore={handleLoadMore}
        isLoading={isProcessing}
      >
        {error && (
          <div role="alert" className="alert alert-error mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}
        <OrderHistoryGrid orders={orders} />
      </SubLayout>
    </div>
  );
};

export default OrdersPage;