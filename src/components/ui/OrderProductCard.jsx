import React from "react";

function OrderProductCard({ name, price, description, image, quantity }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-base-200 rounded-lg">
      <img
        src={image}
        alt={name}
        className="w-24 h-24 object-cover rounded-md"
        onError={(e) =>
          (e.target.src =
            "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp")
        }
      />
      <div className="flex-1 space-y-1">
        <h3 className="text-md font-semibold">{name}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <strong>Price:</strong> ${price.toFixed(2)}
          </div>
          <div>
            <strong>Quantity:</strong> {quantity}
          </div>
          <div className="col-span-2">
            <strong>Subtotal:</strong> ${(price * quantity).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderProductCard;