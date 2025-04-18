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

  // Helper function to get status icon
  const getStatusIcon = (status) => {
    if (status.includes("Delivered")) return "🟢";
    if (status.includes("Cancelled")) return "🔴";
    if (status.includes("Shipped") || status.includes("Picked Up")) return "🚚";
    if (status.includes("Processing") || status.includes("Accepted")) return "🔄";
    if (status.includes("Confirmed")) return "✔️";
    return "🟡";
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    if (status.includes("Delivered")) return "text-success";
    if (status.includes("Cancelled")) return "text-error";
    if (status.includes("Shipped") || status.includes("Picked Up")) return "text-info";
    if (status.includes("Processing") || status.includes("Accepted")) return "text-warning";
    if (status.includes("Confirmed")) return "text-success";
    return "text-primary";
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-lg mb-4">
          Track Order #{order._id.slice(-6)}
        </h3>
        
        {/* Order Summary */}
        <div className="bg-base-200 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold">Shipping Address</h4>
              <p className="text-sm">
                {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.district || "N/A"},{" "}
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Order Date</h4>
              <p className="text-sm">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Items with their status history */}
        <div className="space-y-6">
          {order.items.map((item) => (
            <div key={item._id} className="border rounded-lg overflow-hidden">
              <div className="bg-base-100 p-4 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">
                      {item.productId?.title || "Unknown Product"}
                    </h4>
                    <p className="text-sm">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="badge badge-primary">
                    ${(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Status timeline */}
              <div className="p-4">
                <h5 className="font-medium mb-3">Status Timeline</h5>
                {item.statusHistory?.length > 0 ? (
                  <div className="space-y-3">
                    {item.statusHistory
                      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                      .map((status, idx) => (
                        <div key={status._id} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(status.status)}`}></div>
                            {idx !== item.statusHistory.length - 1 && (
                              <div className="w-px h-6 bg-gray-300"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <p className={`font-medium ${getStatusColor(status.status)}`}>
                                {getStatusIcon(status.status)} {status.status}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(status.updatedAt).toLocaleString()}
                              </p>
                            </div>
                            {status.updatedBy?.role && (
                              <p className="text-xs text-gray-500 mt-1">
                                Updated by: {status.updatedBy.role}
                                {status.updatedBy.userId && ` (${status.updatedBy.userId.slice(-4)})`}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No status history available</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="modal-action mt-6">
          <button
            className="btn btn-primary"
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