import React from "react";
import OrderHistoryCard from "./OrderHistoryCard";

function OrderHistoryGrid({ orders }) {
  if (!orders?.length) {
    return <p className="text-center text-gray-500 py-6">No orders found.</p>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order, index) => (
        <div
          key={order._id}
          className="collapse collapse-arrow bg-base-100 border border-base-300"
        >
          <input
            type="radio"
            name="order-accordion"
            defaultChecked={index === 0}
          />
          <div className="collapse-title font-semibold text-lg">
            Order #{order._id.slice(-6)} -{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </div>
          <div className="collapse-content">
            <OrderHistoryCard order={order} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrderHistoryGrid;