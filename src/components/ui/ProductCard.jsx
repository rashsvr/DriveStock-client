import React, { useState } from "react";
import api from "../../services/api";

const ProductCard = ({ product, onCartShake, onBuyNow }) => {
  const [quantity, setQuantity] = useState(1);
  const [showStockModal, setShowStockModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const defaultImage = "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp";
  const imageUrl = product.images?.length > 0 ? product.images[0] : defaultImage;

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await api.addToCart(product._id, quantity);
      onCartShake();
      alert(`${product.title} added to cart!`);
    } catch (err) {
      if (err.message.includes("stock")) {
        setShowStockModal(true);
      } else {
        alert(err.message || "Failed to add to cart.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="card bg-base-100 w-full max-w-sm sm:max-w-xs shadow-md hover:shadow-lg transition-shadow duration-300 mx-auto">
        <figure className="h-32 w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={product.title}
            className="object-cover w-full h-full"
            onError={(e) => (e.target.src = defaultImage)}
          />
        </figure>
        <div className="card-body p-4">
          <div className="flex items-start gap-2">
            <h2 className="card-title text-base font-semibold truncate flex-1">
              {product.title}
            </h2>
            {product.condition === "New" && (
              <div className="badge badge-secondary badge-sm flex-shrink-0">NEW</div>
            )}
          </div>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">{product.makeModel?.[0]?.make || product.brand || "Unknown"}</span>
            </p>
            <p>
              <span className="font-medium">Availability: </span>
              <span
                className={
                  product.availability === "In Stock"
                    ? "text-green-500"
                    : "text-yellow-500"
                }
              >
                {product.availability}
              </span>
            </p>
            <p>
              <span className="font-semibold text-lg">${product.price.toFixed(2)}</span>
            </p>
            <div className="flex items-center gap-2">
              <label className="font-medium">Qty:</label>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="input input-bordered w-16"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="card-actions mt-4 space-y-2">
            <div className="flex gap-2">
              <button
                className="btn btn-sm bg-orange-500 hover:bg-orange-600 text-white flex-1"
                onClick={() => onBuyNow(product._id, quantity)}
                disabled={isLoading || product.stock < quantity}
              >
                Buy Now
              </button>
              <button
                className="btn btn-sm btn-outline border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white flex-none w-12"
                onClick={handleAddToCart}
                disabled={isLoading || product.stock < quantity}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </button>
            </div>
            <label
              htmlFor={`product-${product._id}`}
              className="btn btn-ghost btn-sm w-full text-center"
            >
              View More..
            </label>
          </div>
        </div>
        <input type="checkbox" id={`product-${product._id}`} className="modal-toggle" />
        <div className="modal" role="dialog">
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="text-lg font-bold mb-4">{product.title}</h3>
            <div className="space-y-3 text-sm grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><span className="font-medium">Description: </span>{product.description || "Unknown"}</p>
              <p><span className="font-medium">Category: </span>{product.category?.name || "Unknown"}</p>
              <p><span className="font-medium">Make: </span>{product.makeModel?.[0]?.make || "Unknown"}</p>
              <p><span className="font-medium">Model: </span>{product.makeModel?.[0]?.model || "Unknown"}</p>
              <p><span className="font-medium">Year: </span>{product.years?.join(", ") || "Unknown"}</p>
              <p><span className="font-medium">Condition: </span>{product.condition || "Unknown"}</p>
              <p><span className="font-medium">Brand: </span>{product.brand || "Unknown"}</p>
              <p><span className="font-medium">OEM/Aftermarket: </span>{product.aftermarket ? "Aftermarket" : "OEM"}</p>
              <p>
                <span className="font-medium">Availability: </span>
                <span
                  className={
                    product.availability === "In Stock"
                      ? "text-green-500"
                      : "text-yellow-500"
                  }
                >
                  {product.availability || "Unknown"}
                </span>
              </p>
              <p><span className="font-medium">Material: </span>{product.material || "Unknown"}</p>
              <p className="col-span-full">
                <span className="font-medium text-lg bg-orange-500 p-3 rounded inline-block">
                  Price: ${product.price.toFixed(2)}
                </span>
              </p>
            </div>
            <div className="modal-action">
              <label htmlFor={`product-${product._id}`} className="btn">Close</label>
            </div>
          </div>
          <label className="modal-backdrop" htmlFor={`product-${product._id}`}></label>
        </div>
      </div>

      {showStockModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-sm">
            <h3 className="font-bold text-lg">Out of Stock</h3>
            <p className="py-4">
              Sorry, only {product.stock} {product.title} available. Please adjust the quantity.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={() => setShowStockModal(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;