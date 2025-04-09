// ProductsPage.jsx
import React, { useState, useEffect } from "react";
import LoadingAnimation from "../components/function/loadingAnimation";
import SubLayout from "../components/ui/SubLayout";
import ProductGrid from "../components/ui/ProductGrid";
import SearchBar from "../components/ui/SearchBar";
import FilterChips from "../components/ui/FilterChips";
import { dummyProducts } from "../data/dummyProducts";

const ProductsPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const limit = 10;

  const fetchProducts = async (isLoadMore = false) => {
    setIsProcessing(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      let filteredProducts = [...dummyProducts];
      
      if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => 
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "All") {
          if (key === "years") {
            filteredProducts = filteredProducts.filter(p => 
              p.years.some(year => value.includes(year.toString()))
            );
          } else if (Array.isArray(value)) {
            filteredProducts = filteredProducts.filter(p => 
              value.some(v => p[key].includes(v))
            );
          } else {
            filteredProducts = filteredProducts.filter(p => 
              p[key].toString().toLowerCase() === value.toLowerCase()
            );
          }
        }
      });

      const start = (page - 1) * limit;
      const paginated = filteredProducts.slice(start, start + limit);
      setProducts(isLoadMore ? [...products, ...paginated] : paginated);
      setTotal(filteredProducts.length);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      setProducts([]);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, filters, page]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
    fetchProducts(true);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1);
  };
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    setPage(1);
  };

  const handleClearAll = () => {
    setSearchTerm("");
    setFilters({});
    setPage(1);
  };

  return (
    <div className="py-6 px-16">
    {isProcessing && <LoadingAnimation />}
    <SubLayout
      title="Products"
      showSearch={true}
      showFilters={true}
      showSecondaryFilters={false}
      showLoadMore={total > products.length}
      onLoadMore={handleLoadMore}
      isLoading={isProcessing}
      SearchComponent={() => <SearchBar onSearch={handleSearch} initialSearch={searchTerm} />}
      FilterComponent={() => (
        <FilterChips 
          onFilterChange={handleFilterChange} 
          onClearAll={handleClearAll}
          hasActiveFilters={Object.values(filters).some(val => val && val !== "All") || searchTerm}
        />
      )}
    >
        {error ? (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
          </div>
        ) : products.length === 0 && !isProcessing ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No products found matching your criteria.</p>
            <button 
              className="btn btn-sm btn-outline mt-4 text-[#F97316]"
              onClick={handleClearAll}
            >
              Clear Search & Filters
            </button>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </SubLayout>
    </div>
  );
};

export default ProductsPage;