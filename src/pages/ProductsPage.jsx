import React, { useState } from "react";
import LoadingAnimation from "../components/function/loadingAnimation";
import SubLayout from "../components/ui/SubLayout";
import ProductGrid from "../components/ui/ProductGrid";
import SearchBar from "../components/ui/SearchBar"; // Ensure this exists
import FilterChips from "../components/ui/FilterChips"; // Ensure this exists

const ProductsPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLoadMore = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
  };

  return (
    <div className="p-6">
      {isProcessing && <LoadingAnimation />}
      <SubLayout
        title="Products"
        showSearch={true}
        showFilters={true}
        showSecondaryFilters={true}
        showLoadMore={true}
        onLoadMore={handleLoadMore}
        isLoading={isProcessing}
        SearchComponent={SearchBar}
        FilterComponent={FilterChips}
        SecondaryFilterComponent={FilterChips}
      >
        <ProductGrid />
      </SubLayout>
    </div>
  );
};

export default ProductsPage;