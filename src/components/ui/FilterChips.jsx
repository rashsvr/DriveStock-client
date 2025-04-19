import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function FilterChips({ onFilterChange, onClearAll, hasActiveFilters }) {
  const [selectedFactor, setSelectedFactor] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
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
            // Store category options with _id and name
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
    setSelectedOption(null);
  };

  const handleOptionSelect = (option) => {
    const optionValue = selectedFactor === 'category' ? option._id : option;
    const optionDisplay = option.name || option;
    setSelectedOption(optionDisplay);
    onFilterChange({ [selectedFactor]: optionValue });
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

  useEffect(() => {
    if (!hasActiveFilters) {
      setSelectedFactor(null);
      setSelectedOption(null);
    }
  }, [hasActiveFilters]);

  return (
    <div className="filter flex flex-wrap gap-2 items-center">
      {loading ? (
        <div className="loading-bar w-full h-4 bg-gray-300 rounded overflow-hidden">
          <div className="h-full bg-[#F97316] animate-pulse" style={{ width: '100%' }}></div>
        </div>
      ) : !selectedFactor ? (
        <>
          {Object.keys(filterOptions).map((factor) => (
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
          {filterOptions[selectedFactor]?.map((option) => (
            <button
              key={option._id || option}
              className={`btn btn-sm ${
                selectedOption === (option.name || option)
                  ? 'bg-[#1A2526] text-[#F97316]'
                  : 'btn-outline text-[#F97316] border-[#F97316]'
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              {option.name || option}
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