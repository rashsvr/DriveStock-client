import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState(null);
  const [singleItem, setSingleItem] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    district: "",
    postalCode: "",
    country: "",
  });

  // List of Sri Lankan districts
  const districts = [
    "Ampara",
    "Anuradhapura",
    "Badulla",
    "Batticaloa",
    "Colombo",
    "Galle",
    "Gampaha",
    "Hambantota",
    "Jaffna",
    "Kalutara",
    "Kandy",
    "Kegalle",
    "Kilinochchi",
    "Kurunegala",
    "Mannar",
    "Matale",
    "Matara",
    "Monaragala",
    "Mullaitivu",
    "Nuwara Eliya",
    "Polonnaruwa",
    "Puttalam",
    "Ratnapura",
    "Trincomalee",
    "Vavuniya",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams(location.search);
        const productId = params.get("productId");

        if (productId) {
          const cartResponse = await api.viewCart();
          const item = cartResponse.data.items.find(
            (i) => i.productId._id === productId
          );
          if (item) {
            setSingleItem(item);
          } else {
            setError("Product not found in cart.");
          }
        } else {
          const cartResponse = await api.viewCart();
          setCart(cartResponse.data);
        }
      } catch (err) {
        setError(err.message || "Failed to load checkout data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (
        !shippingAddress.street ||
        !shippingAddress.city ||
        !shippingAddress.postalCode ||
        !shippingAddress.country
      ) {
        throw { message: "Please fill all required fields." };
      }

      let orderData;
      if (singleItem) {
        orderData = {
          items: [
            { productId: singleItem.productId._id, quantity: singleItem.quantity },
          ],
          shippingAddress,
        };
      } else if (cart) {
        orderData = {
          items: cart.items.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
          })),
          shippingAddress,
        };
      } else {
        throw { message: "No items to checkout." };
      }

      const response = await api.createOrder(orderData);
      const { payhereData } = response.data;

      // Initiate payment using centralized API function
      await api.initiatePayment(
        payhereData,
        () => {
          // On success
          api.clearCart()
            .then(() => {
              navigate("/payment-success?status=completed"); // Ensure status is set
            })
            .catch((err) => {
              setError("Failed to clear cart: " + err.message);
              setIsLoading(false);
            });
        },
        () => {
          // On dismiss
          navigate("/payment-success?status=completed");
          // navigate("/payment-success?status=dismissed");
        },
        (error) => {
          // On error
          navigate(`/payment-success?status=error&error=${encodeURIComponent(error)}`);
        }
      );
    } catch (err) {
      console.error("Checkout Error:", err);
      setError(
        err.message ||
          "Failed to initiate payment. Please check your details and try again."
      );
      setIsLoading(false);
    }
  };

  const total = singleItem
    ? singleItem.productId.price * singleItem.quantity
    : cart?.total || 0;

  return (
    <div className="py-6 px-4 sm:px-16 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      {isLoading && (
        <div className="flex justify-center">
          <span className="loading loading-spinner"></span>
        </div>
      )}
      {error && (
        <div role="alert" className="alert alert-error mb-4">
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
      {(singleItem || cart) && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          {singleItem ? (
            <div className="flex justify-between">
              <span>
                {singleItem.productId.title} (x{singleItem.quantity})
              </span>
              <span>
                ${(singleItem.productId.price * singleItem.quantity).toFixed(2)}
              </span>
            </div>
          ) : (
            cart?.items.map((item) => (
              <div key={item._id} className="flex justify-between">
                <span>
                  {item.productId.title} (x{item.quantity})
                </span>
                <span>${(item.productId.price * item.quantity).toFixed(2)}</span>
              </div>
            ))
          )}
          <div className="flex justify-between font-bold mt-2">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <select
            name="district"
            value={shippingAddress.district}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
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
        <div className="flex gap-4">
          <button
            type="button"
            className="btn btn-outline flex-1"
            onClick={() => navigate(-1)}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            id="payhere-payment"
            className="btn btn-primary flex-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner"></span>
                Processing...
              </>
            ) : (
              "Place Order"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CheckoutPage;