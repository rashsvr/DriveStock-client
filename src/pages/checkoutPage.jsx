import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import LoadingAnimation from "../components/function/loadingAnimation";
import SubLayout from "../components/ui/SubLayout";

const CheckoutPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // Step 1: Form, Step 2: Review
  const [formData, setFormData] = useState({
    receiverName: "",
    address: "",
  });
  const [showSuccess, setShowSuccess] = useState(false); // State for success alert
  const navigate = useNavigate(); // Hook for navigation

  // Simulate processing and show success alert
  const handleProcess = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setShowSuccess(true); // Show success alert
  };

  // Navigate to /orders after showing success alert
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        navigate("/orders"); // Redirect to Order History
      }, 2000); // Show alert for 2 seconds before navigating
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [showSuccess, navigate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Check if form is filled and move to next step
  const handleNext = () => {
    if (formData.receiverName && formData.address) {
      setCurrentStep(2);
    } else {
      alert("Please fill out both receiver name and address.");
    }
  };

  // Sample product data with DaisyUI image
  const product = {
    name: "Sample Product",
    price: 29.99,
    image: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
    description: "A high-quality sample product for testing.",
    quantity: 1,
  };

  // Check if form is filled for button enabling
  const isFormFilled = formData.receiverName && formData.address;

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
                      placeholder="Enter receiver name"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Address</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter shipping address"
                      className="textarea textarea-bordered w-full"
                      rows="4"
                      required
                    />
                  </div>
                </form>
                <div className="text-center mt-4">
                  <button
                    className="btn btn-primary"
                    onClick={handleNext}
                    disabled={!isFormFilled}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Receipt-Like Review */}
          {currentStep === 2 && !showSuccess && (
            <div className="card w-full bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl font-bold text-center">Order Receipt</h2>
                <div className="divider"></div>

                {/* Product Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-gray-600">{product.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <strong>Price:</strong> ${product.price.toFixed(2)}
                    </div>
                    <div>
                      <strong>Quantity:</strong> {product.quantity}
                    </div>
                    <div className="col-span-2">
                      <strong>Subtotal:</strong> ${(product.price * product.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="divider"></div>

                {/* Shipping Details */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Shipping Information</h3>
                  <p>
                    <strong>Receiver:</strong> {formData.receiverName}
                  </p>
                  <p>
                    <strong>Address:</strong> {formData.address}
                  </p>
                </div>

                <div className="divider"></div>

                {/* Total */}
                <div className="text-right">
                  <p className="text-lg font-bold">
                    Total: ${(product.price * product.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Proceed Button */}
                <div className="text-center mt-6">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleProcess}
                    disabled={isProcessing}
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