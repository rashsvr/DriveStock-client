import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function FilterChips({ onFilterChange, onClearAll, hasActiveFilters }) {
  const [selectedFactor, setSelectedFactor] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [filterOptions, setFilterOptions] = useState({});

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await api.getProductFilterOptions();
        setFilterOptions(response.data || {});
      } catch (err) {
        console.error(err);
      }
    };
    fetchFilterOptions();
  }, []);

  const handleFactorSelect = (factor) => {
    setSelectedFactor(factor);
    setSelectedOption(null);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    onFilterChange({ [selectedFactor]: option });
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
      {!selectedFactor ? (
        <>
          {Object.keys(filterOptions).map(factor => (
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
          {filterOptions[selectedFactor]?.map(option => (
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