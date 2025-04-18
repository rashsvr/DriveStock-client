import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    // Extract payment status and error from query params
    const params = new URLSearchParams(location.search);
    const status = params.get("status"); // Expected: "completed", "dismissed", or "error"
    const error = params.get("error");

    if (status === "completed") {
      setPaymentStatus("success");
    } else if (status === "dismissed") {
      setPaymentStatus("dismissed");
    } else if (status === "error" && error) {
      setPaymentStatus("error");
      setErrorMessage(error);
    } else {
      // Redirect to homepage if no valid status is provided
      navigate("/");
    }
  }, [location, navigate]);

  const handleViewOrders = () => {
    navigate("/orders");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleRetryPayment = () => {
    navigate("/checkout");
  };

  return (
    <div className="py-6 px-4 sm:px-16 max-w-2xl mx-auto min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="text-center">
        {paymentStatus === "success" && (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-green-500 mb-2">
              Payment Successful!
            </h1>
            <p className="text-lg text-gray-300 mb-4">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                className="btn btn-primary px-6 py-2"
                onClick={handleViewOrders}
              >
                View Orders
              </button>
              <button
                className="btn btn-outline px-6 py-2"
                onClick={handleGoHome}
              >
                Back to Home
              </button>
            </div>
          </>
        )}

        {paymentStatus === "dismissed" && (
          <>
            <div className="flex justify-center mb-4">
              <XCircle className="w-16 h-16 text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold text-orange-500 mb-2">
              Payment Dismissed
            </h1>
            <p className="text-lg text-gray-300 mb-4">
              You dismissed the payment process. Your order has not been placed.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                className="btn btn-primary px-6 py-2"
                onClick={handleRetryPayment}
              >
                Retry Payment
              </button>
              <button
                className="btn btn-outline px-6 py-2"
                onClick={handleGoHome}
              >
                Back to Home
              </button>
            </div>
          </>
        )}

        {paymentStatus === "error" && (
          <>
            <div className="flex justify-center mb-4">
              <XCircle className="w-16 h-16 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-red-500 mb-2">
              Payment Failed
            </h1>
            <p className="text-lg text-gray-300 mb-4">
              {errorMessage || "An error occurred during payment. Please try again or contact support."}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                className="btn btn-primary px-6 py-2"
                onClick={handleRetryPayment}
              >
                Retry Payment
              </button>
              <button
                className="btn btn-outline px-6 py-2"
                onClick={handleGoHome}
              >
                Back to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;