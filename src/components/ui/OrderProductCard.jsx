import React from 'react'

function OrderProductCard({
    name,
    price,
    description,
    image,
    quantity,
  }) {
    return (
        <div className="flex items-center gap-4 p-4 bg-base-100 shadow rounded-lg">
          <img
            src={image}
            alt={name}
            className="w-24 h-24 object-cover rounded"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-gray-600">{description}</p>
            <div className="grid grid-cols-2 gap-2 text-sm mt-2">
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
    };
    

export default OrderProductCard