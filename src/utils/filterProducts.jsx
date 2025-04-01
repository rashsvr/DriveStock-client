import React from "react";

export const applyFilters = (products, filters) => {
    return products.filter((product) => {
      // Check each filter condition dynamically
      return Object.keys(filters).every((key) => {
        if (!filters[key]) return true; // Skip filters with empty values
        const productValue = product[key];
        if (productValue) {
          if (typeof productValue === "string") {
            return productValue.toLowerCase().includes(filters[key].toLowerCase());
          }
          return productValue === filters[key]; // For non-string values (like numbers)
        }
        return false;
      });
    });
  };
  