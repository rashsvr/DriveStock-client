import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CartGrid from "./CartGrid"; 
import api from "../../services/api";

function CartContent({ onClose, isOpen, triggerShake }) {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const response = await api.viewCart();
      setCart(response.data);
    } catch (err) {
      setError(err.message || "Failed to load cart.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen]);

  const handleRemoveItem = async (productId) => {
    setIsLoading(true);
    try {
      await api.removeFromCart(productId);
      await fetchCart();
      triggerShake();
    } catch (err) {
      setError(err.message || "Failed to remove item.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    setIsLoading(true);
    try {
      await api.updateCartItem(productId, newQuantity);
      await fetchCart();
      triggerShake();
    } catch (err) {
      if (err.message.includes("stock")) {
        alert(err.message);
      } else {
        setError(err.message || "Failed to update quantity.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
    onClose();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-base-200 bg-base-100">
        <h2 className="text-lg sm:text-xl font-bold text-highlight-orange">
          Shopping Cart
        </h2>
        <button
          className="btn btn-ghost text-highlight-orange text-xl"
          onClick={onClose}
          disabled={isLoading}
        >
          ✕
        </button>
      </div>

      {/* Scrollable Cart Items Area */}
      <div className="flex-1 overflow-y-auto" style={{ maxHeight: "calc(6 * 6rem)" }}>
        {isLoading && (
          <div className="flex justify-center py-4">
            <span className="loading loading-spinner"></span>
          </div>
        )}
        {error && (
          <div role="alert" className="alert alert-error m-4">
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
        {cart && cart.items?.length > 0 ? (
          <CartGrid
            items={cart.items}
            onRemove={handleRemoveItem}
            onQuantityChange={handleQuantityChange}
          />
        ) : (
          !isLoading && (
            <p className="text-center text-base-content/50 py-8">
              Your cart is empty
            </p>
          )
        )}
      </div>

      {/* Footer with Total */}
      {cart && cart.items?.length > 0 && (
        <div className="p-4 sm:p-6 border-t border-base-200 bg-base-100">
          <div className="flex justify-between items-center">
            <span className="font-medium text-base-content">Total:</span>
            <span className="font-bold text-lg text-base-content">
              ${cart.total?.toFixed(2) || 0}
            </span>
          </div>
          <button
            className="btn bg-highlight-orange rounded-lg w-full mt-4"
            onClick={handleCheckout}
            disabled={isLoading}
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default CartContent;