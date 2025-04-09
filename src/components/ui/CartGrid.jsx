import React from "react"; 
import CartItem from "./CartIteam";

function CartGrid({ items, onRemove, onQuantityChange }) {
  return (
    <div className="w-full space-y-2">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onRemove={onRemove}
          onQuantityChange={onQuantityChange}
        />
      ))}
    </div>
  );
}

export default CartGrid;