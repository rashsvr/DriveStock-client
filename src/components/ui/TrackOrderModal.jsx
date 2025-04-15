import React, { useState, useEffect } from "react"; 
import api from "../../services/api";
function TrackOrderModal({ orderId, productId, onClose }) {
    const [trackingData, setTrackingData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchTracking = async () => {
        setIsLoading(true);
        try {
          console.log('TrackOrderModal:', { orderId, productId }); // Debug
          const response = await api.trackOrder(orderId, productId);
          setTrackingData(response.data);
        } catch (err) {
          setError(err.message || "Failed to load tracking details.");
        } finally {
          setIsLoading(false);
        }
      };
      if (productId) {
        fetchTracking();
      } else {
        setError("Product ID is missing.");
        setIsLoading(false);
      }
    }, [orderId, productId]);
  
    return (
      <div className="modal modal-open">
        <div className="modal-box max-w-lg">
          <h3 className="font-bold text-lg">Track Order #{orderId.slice(-6)}</h3>
          {isLoading && (
            <div className="flex justify-center py-4">
              <span className="loading loading-spinner"></span>
            </div>
          )}
          {error && (
            <div role="alert" className="alert alert-error my-4">
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
          {trackingData && (
            <div className="space-y-4">
              <div>
                <p>
                  <strong>Product:</strong> {trackingData.item.productId.title}
                </p>
                <p>
                  <strong>Quantity:</strong> {trackingData.item.quantity}
                </p>
                <p>
                  <strong>Status:</strong> {trackingData.item.sellerStatus} /{" "}
                  {trackingData.item.courierStatus}
                </p>
                <p>
                  <strong>Shipping:</strong>{" "}
                  {trackingData.shippingAddress.street},{" "}
                  {trackingData.shippingAddress.city},{" "}
                  {trackingData.shippingAddress.district || "N/A"},{" "}
                  {trackingData.shippingAddress.postalCode},{" "}
                  {trackingData.shippingAddress.country}
                </p>
              </div>
              <div className="divider"></div>
              <h4 className="font-semibold">Tracking History</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {trackingData.item.statusHistory.map((status) => (
                  <div
                    key={status._id}
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
                      <p className="text-sm font-medium">{status.status}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(status.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="modal-action">
            <button
              className="btn btn-outline"
              onClick={onClose}
              disabled={isLoading}
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