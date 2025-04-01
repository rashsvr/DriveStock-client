import React from "react";


const ProductCard = ({ product }) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md w-64">
        <div className="bg-gray-300 h-32 rounded-md mb-2 flex items-center justify-center">
          <span>Image</span>
        </div>
        <h3 className="font-bold">{product.name}</h3>
        <p className="text-sm">{product.location} - {product.condition}</p>
        <p className="font-semibold">{product.price}</p>
        <button className="bg-highlight-blue text-white p-2 mt-2 rounded-md w-full">Buy Now</button>
      </div>
    );
  };
  
  export default ProductCard;
  