import React, { useState } from "react";

const CartItem = ({ item, onRemove, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(item.quantity || 1);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
      onQuantityChange(item.productId._id, newQuantity);
    }
  };

  return (
    <div className="w-full grid grid-rows-3 gap-1 p-3 bg-base-100 border-b border-base-200 hover:bg-base-200 transition-colors duration-200">
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0 w-10 h-10">
          <img
            src={item.productId.images[0] || "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"}
            alt={item.productId.title}
            className="w-full h-full object-cover rounded"
            onError={(e) => (e.target.src = "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp")}
          />
        </div>
        <h3 className="text-sm font-semibold line-clamp-2 text-base-content">
          {item.productId.title}
        </h3>
      </div>
      <div className="flex justify-between text-xs text-base-content/70">
        <span>{item.productId.brand}</span>
        <span className="font-medium text-base-content">${item.productId.price.toFixed(2)}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            className="btn btn-xs btn-circle btn-neutral"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="text-sm w-6 text-center text-base-content">
            {quantity}
          </span>
          <button
            className="btn btn-xs btn-circle btn-neutral"
            onClick={() => handleQuantityChange(quantity + 1)}
          >
            +
          </button>
        </div>
        <button
          className="btn btn-ghost btn-xs text-error"
          onClick={() => onRemove(item.productId._id)}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default CartItem;