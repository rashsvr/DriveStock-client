import React, { useState } from "react";

function CheckoutModal({ onConfirm, onClose, isLoading }) {
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    district: "",
    postalCode: "",
    country: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
      alert("Please fill all required fields.");
      return;
    }
    onConfirm(shippingAddress);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-lg">Checkout</h3>
        <div className="space-y-4 mt-4">
          <div>
            <label className="label">
              <span className="label-text">Street Address *</span>
            </label>
            <input
              type="text"
              name="street"
              value={shippingAddress.street}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">City *</span>
            </label>
            <input
              type="text"
              name="city"
              value={shippingAddress.city}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">District</span>
            </label>
            <input
              type="text"
              name="district"
              value={shippingAddress.district}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Postal Code *</span>
            </label>
            <input
              type="text"
              name="postalCode"
              value={shippingAddress.postalCode}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Country *</span>
            </label>
            <input
              type="text"
              name="country"
              value={shippingAddress.country}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>
        </div>
        <div className="modal-action">
          <button
            className="btn btn-outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner"></span>
                Processing...
              </>
            ) : (
              "Confirm Order"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutModal;