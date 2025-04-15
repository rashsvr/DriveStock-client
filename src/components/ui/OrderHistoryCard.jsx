import React, { useState } from "react";
import OrderProductCard from "./OrderProductCard";
import TrackOrderModal from "./TrackOrderModal"; 
import api from "../../services/api";
function OrderHistoryCard({ order }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTrackModal, setShowTrackModal] = useState(false);

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      setIsLoading(true);
      setError(null);
      try {
        await api.cancelOrder(order._id);
        window.location.reload();
      } catch (err) {
        setError(err.message || "Failed to cancel order.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleTrack = () => {
    console.log('OrderHistoryCard track:', { orderId: order._id, productId }); // Debug
    setShowTrackModal(true);
  };

  const canCancel = order.items.some(
    (item) =>
      item.sellerStatus !== "Cancelled" &&
      item.sellerStatus !== "Shipped" &&
      item.sellerStatus !== "Delivered"
  );

  const getOrderStatus = () => {
    const item = order.items[0];
    return item.sellerStatus === "Cancelled"
      ? "Cancelled"
      : item.courierStatus === "Delivered"
      ? "Delivered"
      : item.sellerStatus === "Shipped"
      ? "Shipped"
      : item.sellerStatus === "Accepted"
      ? "Processing"
      : "Pending";
  };

  const productId = order.items[0]?.productId?._id;
  console.log('OrderHistoryCard productId:', productId); // Debug

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Order #{order._id.slice(-6)}</h2>
        <span
          className={`badge ${
            getOrderStatus() === "Cancelled"
              ? "badge-error"
              : getOrderStatus() === "Delivered"
              ? "badge-success"
              : getOrderStatus() === "Shipped"
              ? "badge-info"
              : getOrderStatus() === "Processing"
              ? "badge-warning"
              : "badge-primary"
          }`}
        >
          {getOrderStatus()}
        </span>
      </div>
      <p className="text-sm text-gray-500">
        Placed on: {new Date(order.createdAt).toLocaleDateString()}
      </p>
      <div className="divider"></div>

      <div className="space-y-4">
        {order.items.map((item) => (
          <OrderProductCard
            key={item._id}
            name={item.productId.title}
            price={item.price}
            description={`${item.productId.brand} - ${item.productId.condition}`}
            image={
              item.productId.images[0] ||
              "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            }
            quantity={item.quantity}
          />
        ))}
      </div>

      <div className="divider"></div>

      <div className="space-y-2">
        <h3 className="text-md font-semibold">Shipping Address</h3>
        <p className="text-sm">
          {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
          {order.shippingAddress.district || "N/A"},{" "}
          {order.shippingAddress.postalCode}, {order.shippingAddress.country}
        </p>
      </div>

      {error && (
        <div role="alert" className="alert alert-error mt-4">
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

      <div className="flex justify-end gap-2 mt-4">
        <button
          className="btn btn-primary"
          onClick={handleTrack}
          disabled={isLoading || !productId}
          aria-label="Track order"
        >
          Track Order
        </button>
        {canCancel && (
          <button
            className="btn btn-outline btn-error"
            onClick={handleCancel}
            disabled={isLoading}
            aria-label="Cancel order"
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner"></span>
                Cancelling...
              </>
            ) : (
              "Cancel Order"
            )}
          </button>
        )}
      </div>

      {showTrackModal && productId && (
        <TrackOrderModal
          orderId={order._id}
          productId={productId}
          onClose={() => setShowTrackModal(false)}
        />
      )}
    </div>
  );
}

export default OrderHistoryCard;