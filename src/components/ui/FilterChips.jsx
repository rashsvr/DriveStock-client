// FilterChips.jsx
import React, { useState, useEffect } from 'react';

function FilterChips({ onFilterChange, onClearAll, hasActiveFilters }) {
  const [selectedFactor, setSelectedFactor] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const filterFactors = [
    "condition",
    "brand",
    "availability",
    "make",
    "model",
    "years"
  ];

  const filterOptions = {
    condition: ["All", "New", "Used", "Refurbished"],
    brand: ["All", "Bosch", "Denso", "Brembo"],
    availability: ["All", "In Stock", "Out of Stock"],
    make: ["All", "Toyota", "Nissan"],
    model: ["All", "Corolla", "Altima", "Camry"],
    years: ["All", "2015", "2016", "2018", "2020"],
  };

  const handleFactorSelect = (factor) => {
    setSelectedFactor(factor);
    // Don't reset selectedOption here - let it persist until explicit clear
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    onFilterChange({ [selectedFactor]: option });
    // Don't reset anything here - keep selections visible
  };

  const handleRemoveOption = () => {
    setSelectedOption(null);
    onFilterChange({ [selectedFactor]: null });
  };

  const handleRemoveFactor = () => {
    setSelectedFactor(null);
    setSelectedOption(null);
    onFilterChange({});
  };

  // Sync with parent filters if they change externally (e.g., Clear All)
  useEffect(() => {
    if (!hasActiveFilters) {
      setSelectedFactor(null);
      setSelectedOption(null);
    }
  }, [hasActiveFilters]);

  return (
    <div className="filter flex flex-wrap gap-2 items-center">
      {!selectedFactor ? (
        <>
          {filterFactors.map(factor => (
            <button
              key={factor}
              className="btn btn-sm btn-outline text-[#F97316] border-[#F97316]"
              onClick={() => handleFactorSelect(factor)}
            >
              {factor.charAt(0).toUpperCase() + factor.slice(1)}
            </button>
          ))}
        </>
      ) : (
        <>
          <div className="btn btn-sm bg-[#1A2526] text-[#F97316] flex items-center gap-1">
            {selectedFactor.charAt(0).toUpperCase() + selectedFactor.slice(1)}
            <button 
              onClick={handleRemoveFactor}
              className="text-[#F97316] hover:text-[#F97316]/80"
            >
              ×
            </button>
          </div>
          {selectedOption && (
            <div className="btn btn-sm bg-[#1A2526] text-[#F97316] flex items-center gap-1">
              {selectedOption}
              <button 
                onClick={handleRemoveOption}
                className="text-[#F97316] hover:text-[#F97316]/80"
              >
                ×
              </button>
            </div>
          )}
          {filterOptions[selectedFactor].map(option => (
            <button
              key={option}
              className={`btn btn-sm ${
                selectedOption === option 
                  ? 'bg-[#1A2526] text-[#F97316]' 
                  : 'btn-outline text-[#F97316] border-[#F97316]'
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </button>
          ))}
        </>
      )}
      {hasActiveFilters && (
        <button
          className="btn btn-sm bg-[#1A2526] text-[#F97316]"
          onClick={onClearAll}
        >
          Clear All
        </button>
      )}
    </div>
  );
}

export default FilterChips;