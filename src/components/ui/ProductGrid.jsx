import React from 'react';
import ProductCard from './ProductCard';

function ProductGrid({ products, onBuyNow }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-10 lg:gap-12 xl:gap-16">
      {products.map(product => (
        <div key={product._id}>
          <ProductCard product={product} onBuyNow={onBuyNow} />
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;