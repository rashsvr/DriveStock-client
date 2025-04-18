import React, { useState } from "react";
import api from "../../services/api";

const ComplaintModal = ({ order, onClose }) => {
  // Find the first delivered item
  const deliveredItem = order.items.find(
    (item) => item.courierStatus === "Delivered"
  );
  const productId = deliveredItem?.productId._id || "";
  const refundAmount = deliveredItem?.price || 0;

  const [description, setDescription] = useState("");
  const [refundRequested, setRefundRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Predefined issue suggestions
  const issueSuggestions = [
    "Product is damaged or defective",
    "Wrong item received",
    "Item does not match description",
    "Item is missing parts or accessories",
    "Poor quality or performance",
    "Item arrived late",
  ];

  // Handle clicking a suggestion chip
  const handleSuggestionClick = (suggestion) => {
    setDescription(suggestion);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.makeComplaint(order._id, {
        productId,
        description,
        refundRequested,
        refundAmount: refundRequested ? parseFloat(refundAmount) : undefined,
      });
      setSuccess("Complaint submitted successfully!");
      setDescription("");
      setRefundRequested(false);
    } catch (err) {
      setError(err.message || "Failed to submit complaint.");
    } finally {
      setIsLoading(false);
      // Close the modal after 10 seconds, regardless of success or error
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Submit a Complaint</h3>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Product Information */}
          <div>
            <label className="label">
              <span className="label-text">Product</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={
                deliveredItem
                  ? `${deliveredItem.productId.title} (${deliveredItem.productId.brand} - ${deliveredItem.productId.condition})`
                  : "No delivered item found"
              }
              disabled
            />
          </div>

          {/* Issue Suggestions */}
          <div>
            <label className="label">
              <span className="label-text">Common Issues</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {issueSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={isLoading}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label">
              <span className="label-text">Complaint Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your issue or select a suggestion above..."
              required
            ></textarea>
          </div>

          {/* Refund Request */}
          <div>
            <label className="label cursor-pointer">
              <span className="label-text">Request a Refund</span>
              <input
                type="checkbox"
                checked={refundRequested}
                onChange={(e) => setRefundRequested(e.target.checked)}
                className="checkbox"
              />
            </label>
          </div>

          {/* Refund Amount (Display Only) */}
          {refundRequested && (
            <div>
              <label className="label">
                <span className="label-text">Refund Amount</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={refundAmount}
                disabled
              />
            </div>
          )}

          {/* Error/Success Messages */}
          {error && (
            <div role="alert" className="alert alert-error">
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
          {success && (
            <div role="alert" className="alert alert-success">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !deliveredItem}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Submitting...
                </>
              ) : (
                "Submit Complaint"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintModal;