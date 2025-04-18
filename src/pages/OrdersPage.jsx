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
  const [activeTab, setActiveTab] = useState("Payment Pending");

  const fetchOrders = async (pageNum) => {
    setIsProcessing(true);
    try {
      const response = await api.getOrderHistory({ page: pageNum, limit: 5 });
      const newOrders = response.data || [];
      setOrders((prev) => {
        const combined = pageNum === 1 ? newOrders : [...prev, ...newOrders];
        const uniqueOrders = Array.from(
          new Map(combined.map((order) => [order._id, order])).values()
        );
        return uniqueOrders;
      });
      setHasMore(newOrders.length === 5);
    } catch (err) {
      setError(err.message || "Failed to load order history.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchOrders(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchOrders(nextPage);
  };

  const getOrderStatus = (order) => {
    const item = order.items[0];
    return item.orderStatus; // Use the unified orderStatus from the API response
  };

  const filteredOrders = orders.filter((order) => getOrderStatus(order) === activeTab);

  const tabs = [
    {
      name: "Payment Pending",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-4 me-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ),
    },
    {
      name: "Order Accepted",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-4 me-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75m-6-9A9 9 0 0 1 21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043Z"
          />
        </svg>
      ),
    },
    {
      name: "Processing",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-4 me-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      ),
    },
    {
      name: "Shipped - Awaiting Courier",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-4 me-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0 0 3m3-18.75v-1.5a1.5 1.5 0 0 0-3 0v1.5m3 18.75a1.5 1.5 0 0 1 0 3m-3-3a1.5 1.5 0 0 0 3 0m3-18.75a1.5 1.5 0 0 1 3 0v1.5m-3 0a1.5 1.5 0 0 0 0-3m3 18.75v1.5a1.5 1.5 0 0 0 3 0v-1.5m-3 0a1.5 1.5 0 0 1 0 3m-7.5-13.5h13.5m-13.5 4.5h13.5"
          />
        </svg>
      ),
    },
    {
      name: "Picked Up by Courier",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-4 me-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0 0 3m3-18.75v-1.5a1.5 1.5 0 0 0-3 0v1.5m3 18.75a1.5 1.5 0 0 1 0 3m-3-3a1.5 1.5 0 0 0 3 0m3-18.75a1.5 1.5 0 0 1 3 0v1.5m-3 0a1.5 1.5 0 0 0 0-3m3 18.75v1.5a1.5 1.5 0 0 0 3 0v-1.5m-3 0a1.5 1.5 0 0 1 0 3m-7.5-13.5h13.5m-13.5 4.5h13.5"
          />
        </svg>
      ),
    },
    {
      name: "In Transit",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-4 me-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0 0 3m3-18.75v-1.5a1.5 1.5 0 0 0-3 0v1.5m3 18.75a1.5 1.5 0 0 1 0 3m-3-3a1.5 1.5 0 0 0 3 0m3-18.75a1.5 1.5 0 0 1 3 0v1.5m-3 0a1.5 1.5 0 0 0 0-3m3 18.75v1.5a1.5 1.5 0 0 0 3 0v-1.5m-3 0a1.5 1.5 0 0 1 0 3m-7.5-13.5h13.5m-13.5 4.5h13.5"
          />
        </svg>
      ),
    },
    {
      name: "Out for Delivery",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-4 me-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0 0 3m3-18.75v-1.5a1.5 1.5 0 0 0-3 0v1.5m3 18.75a1.5 1.5 0 0 1 0 3m-3-3a1.5 1.5 0 0 0 3 0m3-18.75a1.5 1.5 0 0 1 3 0v1.5m-3 0a1.5 1.5 0 0 0 0-3m3 18.75v1.5a1.5 1.5 0 0 0 3 0v-1.5m-3 0a1.5 1.5 0 0 1 0 3m-7.5-13.5h13.5m-13.5 4.5h13.5"
          />
        </svg>
      ),
    },
    {
      name: "Delivered",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-4 me-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
          />
        </svg>
      ),
    },
    {
      name: "Delivery Failed",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-4 me-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
      ),
    },
    {
      name: "Cancelled",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-4 me-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="py-4 px-2 sm:px-4 lg:px-6 min-h-screen">
      {isProcessing && <LoadingAnimation />}
      <SubLayout
        title="Order History"
        showLoadMore={hasMore}
        onLoadMore={handleLoadMore}
        isLoading={isProcessing}
      >
        {error && (
          <div role="alert" className="alert alert-error mb-4 max-w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 shrink-0 stroke-current"
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
            <span className="text-sm">{error}</span>
          </div>
        )}
        <div className="tabs tabs-boxed flex flex-wrap justify-start gap-2 mb-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`tab flex items-center px-3 py-2 text-sm font-medium ${
                activeTab === tab.name ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.name}</span>
              <span className="sm:hidden">{tab.name.split(" ")[0]}</span>
            </button>
          ))}
        </div>
        <div className="mt-4">
          <OrderHistoryGrid orders={filteredOrders} />
        </div>
      </SubLayout>
    </div>
  );
};

export default OrdersPage;