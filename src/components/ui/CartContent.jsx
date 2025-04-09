import React, { useState } from "react";
import CartGrid from "./CartGrid";

function CartContent({ onClose }) {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Toyota Corolla Brake Pads",
      make: ["Toyota"],
      price: 80,
      brand: "Bosch",
    },
    {
      id: 2,
      name: "Honda Civic Air Filter",
      make: ["Honda"],
      price: 25,
      brand: "K&N",
    },
    {
      id: 3,
      name: "Ford Focus Spark Plugs",
      make: ["Ford"],
      price: 15,
      brand: "NGK",
    },
    {
      id: 4,
      name: "BMW X5 Oil Filter",
      make: ["BMW"],
      price: 30,
      brand: "Mann",
    },
    {
      id: 5,
      name: "Audi A4 Brake Discs",
      make: ["Audi"],
      price: 120,
      brand: "Brembo",
    },
    {
      id: 6,
      name: "Mercedes C-Class Wiper Blades",
      make: ["Mercedes"],
      price: 40,
      brand: "Bosch",
    },
  ]);

  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-base-200 bg-base-100">
        <h2 className="text-lg sm:text-xl font-bold  text-highlight-orange">
          Shopping Cart
        </h2>
        <button
          className="btn btn-ghost   text-highlight-orange text-xl"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      {/* Scrollable Cart Items Area */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ maxHeight: "calc(6 * 6rem)" }}
      >
        {cartItems.length > 0 ? (
          <CartGrid
            items={cartItems}
            onRemove={handleRemoveItem}
            onQuantityChange={handleQuantityChange}
          />
        ) : (
          <p className="text-center text-base-content/50 py-8">
            Your cart is empty
          </p>
        )}
      </div>

      {/* Footer with Total */}
      {cartItems.length > 0 && (
        <div className="p-4 sm:p-6 border-t border-base-200 bg-base-100">
          <div className="flex justify-between items-center">
            <span className="font-medium text-base-content">Total:</span>
            <span className="font-bold text-lg text-base-content">
              $
              {cartItems
                .reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
                .toFixed(2)}
            </span>
          </div>
          <button className="btn bg-highlight-orange rounded-lg w-full mt-4">Checkout</button>
        </div>
      )}
    </div>
  );
}

export default CartContent;