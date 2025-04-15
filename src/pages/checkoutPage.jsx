import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingAnimation from "../components/function/loadingAnimation";
import SubLayout from "../components/ui/SubLayout";
import OrderProductCard from "../components/ui/OrderProductCard";
import api from "../services/api";

const CheckoutPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    receiverName: "",
    street: "",
    city: "",
    country: "",
    district: "",
    postalCode: "",
  });
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch product details
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const productId = params.get("productId");
    if (productId) {
      const fetchProduct = async () => {
        try {
          setIsProcessing(true);
          const response = await api.getProductById(productId);
          setProduct({
            id: response.data._id,
            name: response.data.title,
            price: response.data.price,
            image:
              response.data.images?.[0] ||
              "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
            description: response.data.description || "No description available",
            quantity: 1,
          });
        } catch (err) {
          setError(err.message || "Failed to load product details.");
        } finally {
          setIsProcessing(false);
        }
      };
      fetchProduct();
    } else {
      setError("No product selected for checkout.");
    }
  }, [location.search]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate and move to next step
  const handleNext = () => {
    const requiredFields = ["receiverName", "street", "city", "country", "postalCode"];
    const isFilled = requiredFields.every((field) => formData[field]?.trim());
    if (isFilled) {
      setCurrentStep(2);
      setError(null);
    } else {
      setError("Please fill out all required fields (Receiver Name, Street, City, Country, Postal Code).");
    }
  };

  // Create order
  const handleProcess = async () => {
    if (!product) {
      setError("No product selected.");
      return;
    }

    const shippingAddress = {
      street: formData.street.trim(),
      city: formData.city.trim(),
      country: formData.country.trim(),
      district: formData.district.trim() || "",
      postalCode: formData.postalCode.trim(),
    };

    const requiredFields = ["street", "city", "country", "postalCode"];
    const isAddressValid = requiredFields.every((field) => shippingAddress[field]);

    if (!isAddressValid) {
      setError("Please fill out all required address fields (Street, City, Country, Postal Code).");
      return;
    }

    const orderData = {
      items: [{ productId: product.id, quantity: product.quantity }],
      shippingAddress,
    };

    console.log("Order payload:", JSON.stringify(orderData, null, 2));

    setIsProcessing(true);
    setError(null);
    try {
      const response = await api.createOrder(orderData);
      console.log("Order response:", response);
      setShowSuccess(true);
    } catch (err) {
      console.error("Order creation error:", err);
      setError(
        err.code === 401
          ? "Please log in to place an order."
          : err.message || "Failed to create order. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Navigate to /orders after success
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        navigate("/orders");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate]);

  // Handle cancellation
  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      navigate("/products");
    }
  };

  // Check if form is filled
  const isFormFilled = ["receiverName", "street", "city", "country", "postalCode"].every(
    (field) => formData[field]?.trim()
  );

  return (
    <div className="p-6">
      {isProcessing && <LoadingAnimation />}
      <SubLayout title="Checkout">
        <div className="space-y-6">
          {/* Stepper */}
          <ul className="steps w-full mb-6">
            <li
              className={`step ${currentStep >= 1 ? "step-primary" : ""}`}
              data-content={currentStep > 1 ? "✓" : "1"}
            >
              Fill Shipping Details
            </li>
            <li
              className={`step ${currentStep >= 2 ? "step-primary" : ""}`}
              data-content={currentStep === 2 ? "2" : "✓"}
            >
              Review and Proceed
            </li>
          </ul>

          {/* Error Alert */}
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

          {/* Success Alert */}
          {showSuccess && (
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Your purchase has been confirmed!</span>
            </div>
          )}

          {/* Step 1: Form */}
          {currentStep === 1 && !showSuccess && (
            <div className="card w-full bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl font-bold">Shipping Details</h2>
                <form className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Receiver Name</span>
                    </label>
                    <input
                      type="text"
                      name="receiverName"
                      value={formData.receiverName}
                      onChange={handleInputChange}
                      placeholder="e.g., John Doe"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Street Address</span>
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      placeholder="e.g., 123 Main St"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">City</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g., Colombo"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Country</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="e.g., Sri Lanka"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">District (Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      placeholder="e.g., Puttalam"
                      className="input input-bordered w-full"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Postal Code</span>
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="e.g., 10000"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                </form>
                <div className="text-center mt-4 flex gap-4 justify-center">
                  <button
                    className="btn btn-primary"
                    onClick={handleNext}
                    disabled={!isFormFilled || isProcessing}
                    aria-label="Proceed to review order"
                  >
                    Next
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={handleCancel}
                    disabled={isProcessing}
                    aria-label="Cancel checkout"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {currentStep === 2 && !showSuccess && product && (
            <div className="card w-full bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl font-bold text-center">Order Receipt</h2>
                <div className="divider"></div>

                <OrderProductCard {...product} />

                <div className="divider"></div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Shipping Information</h3>
                  <p>
                    <strong>Receiver:</strong> {formData.receiverName}
                  </p>
                  <p>
                    <strong>Address:</strong> {formData.street}, {formData.city},{" "}
                    {formData.district || "N/A"}, {formData.postalCode}, {formData.country}
                  </p>
                </div>

                <div className="divider"></div>

                <div className="text-right">
                  <p className="text-lg font-bold">
                    Total: ${(product.price * product.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="text-center mt-6 flex gap-4 justify-center">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleProcess}
                    disabled={isProcessing}
                    aria-label="Confirm order"
                  >
                    {isProcessing ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Processing...
                      </>
                    ) : (
                      "Proceed"
                    )}
                  </button>
                  <button
                    className="btn btn-outline btn-lg"
                    onClick={handleCancel}
                    disabled={isProcessing}
                    aria-label="Cancel checkout"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </SubLayout>
    </div>
  );
};

export default CheckoutPage;