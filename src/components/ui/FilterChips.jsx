import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function FilterChips({ onFilterChange, onClearAll, hasActiveFilters }) {
  const [selectedFactor, setSelectedFactor] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        const response = await api.getProductFilterOptions();
        const data = response.data || {};

        // Process filter options
        const processedOptions = {};
        Object.keys(data).forEach((key) => {
          if (key === 'category') {
            processedOptions[key] = data[key].flatMap(category =>
              category.categoryOption.map(option => ({
                _id: option._id,
                name: option.name,
              }))
            );
          } else if (key !== 'priceRange') {
            processedOptions[key] = data[key];
          }
        });

        setFilterOptions(processedOptions);
      } catch (err) {
        console.error('Failed to fetch filter options:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFilterOptions();
  }, []);

  const handleFactorSelect = (factor) => {
    setSelectedFactor(factor);
  };

  const handleOptionSelect = (option) => {
    const optionValue = selectedFactor === 'category' ? option._id : option;
    const optionDisplay = option.name || option;
    setSelectedFilters(prev => ({
      ...prev,
      [selectedFactor]: { value: optionValue, display: optionDisplay },
    }));
    setSelectedFactor(null); // Reset to show all factors after selection
  };

  const handleRemoveOption = (factor) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[factor];
      return newFilters;
    });
    if (selectedFactor === factor) {
      setSelectedFactor(null);
    }
  };

  const handleApplyFilters = () => {
    const filtersToApply = {};
    Object.entries(selectedFilters).forEach(([factor, { value }]) => {
      if (value && value !== 'All') {
        filtersToApply[factor] = value;
      }
    });
    onFilterChange(filtersToApply);
  };

  const handleClearAll = () => {
    setSelectedFilters({});
    setSelectedFactor(null);
    onClearAll();
  };

  // Get unselected factors (those not in selectedFilters)
  const unselectedFactors = Object.keys(filterOptions).filter(
    factor => !selectedFilters[factor]
  );

  return (
    <div className="filter flex flex-wrap gap-2 items-center">
      {loading ? (
        <div className="loading-bar w-full h-4 bg-gray-300 rounded overflow-hidden">
          <div className="h-full bg-[#F97316] animate-pulse" style={{ width: '100%' }}></div>
        </div>
      ) : (
        <>
          {/* Display selected filters as chips */}
          {Object.entries(selectedFilters).map(([factor, { display }]) => (
            <div
              key={factor}
              className="btn btn-sm bg-[#1A2526] text-[#F97316] flex items-center gap-1 border-2 border-[#F97316]"
              onClick={() => handleFactorSelect(factor)}
            >
              {factor.charAt(0).toUpperCase() + factor.slice(1)}: {display}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering handleFactorSelect
                  handleRemoveOption(factor);
                }}
                className="text-[#F97316] hover:text-[#F97316]/80"
              >
                ×
              </button>
            </div>
          ))}

          {/* Display options for selected factor or unselected factors */}
          {selectedFactor ? (
            filterOptions[selectedFactor].map((option) => (
              <button
                key={option._id || option}
                className={`btn btn-sm ${
                  selectedFilters[selectedFactor]?.display === (option.name || option)
                    ? 'bg-[#1A2526] text-[#F97316] border-2 border-[#F97316]'
                    : 'btn-outline text-[#F97316] border-[#F97316]'
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                {option.name || option}
              </button>
            ))
          ) : (
            unselectedFactors.map((factor) => (
              <button
                key={factor}
                className="btn btn-sm btn-outline text-[#F97316] border-[#F97316]"
                onClick={() => handleFactorSelect(factor)}
              >
                {factor.charAt(0).toUpperCase() + factor.slice(1)}
              </button>
            ))
          )}

          {/* Apply Filters button */}
          {Object.keys(selectedFilters).length > 0 && (
            <button
              className="btn btn-sm bg-[#F97316] text-white hover:bg-[#F97316]/80"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
          )}

          {/* Clear All button */}
          {hasActiveFilters && (
            <button
              className="btn btn-sm bg-[#1A2526] text-[#F97316]"
              onClick={handleClearAll}
            >
              Clear All
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default FilterChips;