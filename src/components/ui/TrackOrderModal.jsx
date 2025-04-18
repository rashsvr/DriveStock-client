import React from "react";

function TrackOrderModal({ order, onClose }) {
  // Validate order and items
  if (!order || !order.items || !Array.isArray(order.items)) {
    console.error("Invalid order data:", order);
    return (
      <div className="modal modal-open">
        <div className="modal-box max-w-lg">
          <h3 className="font-bold text-lg">Error</h3>
          <p className="py-4">Invalid order data. Please try again.</p>
          <div className="modal-action">
            <button className="btn btn-outline" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Combine status history from all items into a single array
  const allStatusHistory = order.items
    .flatMap((item) => {
      // Validate item and statusHistory
      if (!item || !item.statusHistory || !Array.isArray(item.statusHistory)) {
        console.warn(`Invalid statusHistory for item ${item?._id}:`, item);
        return [];
      }
      return item.statusHistory.map((status) => ({
        ...status,
        itemId: item._id,
        productTitle: item.productId?.title || "Unknown Product",
        updatedAt: status.updatedAt || new Date().toISOString(), // Fallback for missing updatedAt
      }));
    })
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // Sort by most recent first

  // Debug: Log the combined status history
  console.log("All Status History:", allStatusHistory);

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg">
        <h3 className="font-bold text-lg">Track Order #{order._id.slice(-6)}</h3>
        <div className="space-y-4">
          {/* Display item details */}
          {order.items.map((item) => (
            <div key={item._id} className="border p-4 rounded-lg">
              <div>
                <p>
                  <strong>Product:</strong> {item.productId?.title || "Unknown Product"}
                </p>
                <p>
                  <strong>Quantity:</strong> {item.quantity}
                </p>
                <p>
                  <strong>Status:</strong> {item.sellerStatus} / {item.courierStatus}
                </p>
                <p>
                  <strong>Shipping:</strong> {order.shippingAddress.street},{" "}
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.district || "N/A"},{" "}
                  {order.shippingAddress.postalCode},{" "}
                  {order.shippingAddress.country}
                </p>
              </div>
            </div>
          ))}

          {/* Unified scrollable status history */}
          <div className="divider"></div>
          <h4 className="font-semibold">Tracking History</h4>
          <div
            className="max-h-64 overflow-y-auto space-y-2"
            role="region"
            aria-label="Tracking history"
          >
            {allStatusHistory.length > 0 ? (
              allStatusHistory.map((status, index) => (
                <div
                  key={`${status.itemId}-${status._id}-${index}`} // Unique key with index fallback
                  className="flex items-start gap-2 p-2 bg-base-100 rounded"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5 text-primary mt-0.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium">
                      {status.productTitle}: {status.status}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(status.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No tracking history available.</p>
            )}
          </div>
        </div>

        <div className="modal-action">
          <button
            className="btn btn-outline"
            onClick={onClose}
            aria-label="Close modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default TrackOrderModal;