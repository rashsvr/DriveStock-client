// ProductCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const handleAddToCart = () => {
        console.log(`Added ${product.title} to cart`);
    };

    return (
        <div className="card bg-base-100 w-full max-w-sm sm:max-w-xs shadow-md hover:shadow-lg transition-shadow duration-300 mx-auto">
            <figure className="h-32 w-full overflow-hidden">
                <img
                    src={product.images[0] || "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"}
                    alt={product.title}
                    className="object-cover w-full h-full"
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
                        <span className="font-medium">{product.make?.join(", ") || "N/A"}</span>
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
                        <span className="font-semibold text-lg">${product.price}</span>
                    </p>
                </div>

                <div className="card-actions mt-4 space-y-2">
                    <div className="flex gap-2">
                        <button 
                            className="btn btn-sm bg-orange-500 hover:bg-orange-600 text-white flex-1"
                            onClick={() => navigate("/checkout")}
                        >
                            Buy Now
                        </button>
                        <button 
                            className="btn btn-sm btn-outline border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white flex-none w-12"
                            onClick={handleAddToCart}
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-5 w-5" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
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
                        <p><span className="font-medium">Code: </span>{product.code || "N/A"}</p>
                        <p><span className="font-medium">Category: </span>{product.category?.name || "N/A"}</p>
                        <p><span className="font-medium">Description: </span>{product.description || "N/A"}</p>
                        <p><span className="font-medium">Make: </span>{product.make?.join(", ") || "N/A"}</p>
                        <p><span className="font-medium">Model: </span>{product.model?.join(", ") || "N/A"}</p>
                        <p><span className="font-medium">Year: </span>{product.years?.join(", ") || "N/A"}</p>
                        <p><span className="font-medium">Condition: </span>{product.condition}</p>
                        <p><span className="font-medium">Brand: </span>{product.brand}</p>
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
                                {product.availability}
                            </span>
                        </p>
                        <p><span className="font-medium">Material: </span>{product.material || "N/A"}</p>
                        <p><span className="font-medium">Seller Location: </span>{product.sellerLocation || "N/A"}</p>
                        <p className="col-span-full">
                            <span className="font-medium text-lg bg-orange-500 p-3 rounded inline-block">
                                Price: ${product.price}
                            </span>
                        </p>
                    </div>
                </div>
                <label className="modal-backdrop" htmlFor={`product-${product._id}`}>
                    Close
                </label>
            </div>
        </div>
    );
};

export default ProductCard;