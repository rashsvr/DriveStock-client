import { useState } from "react";
import { filterOptions } from "../data/data";

const FilterOptions = ({ onFilter }) => {
  const [selectedFilter, setSelectedFilter] = useState({
    category: "",
    price: "",
    condition: "",
    Category:""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilter = { ...selectedFilter, [name]: value };
    setSelectedFilter(newFilter);
    onFilter(newFilter); // Pass the updated filter to the parent
  };

  return (
    <div className="flex gap-4 mt-4">
      <select
        name="category"
        value={selectedFilter.category}
        onChange={handleChange}
        className="p-2 border rounded-lg"
      >
        <option value="">Select Category</option>
        {filterOptions.Category.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select
        name="price"
        value={selectedFilter.price}
        onChange={handleChange}
        className="p-2 border rounded-lg"
      >
        <option value="">Select Price</option>
        {filterOptions.Price.map((price, index) => (
          <option key={index} value={price}>
            {price}
          </option>
        ))}
      </select>

      <select
        name="condition"
        value={selectedFilter.condition}
        onChange={handleChange}
        className="p-2 border rounded-lg"
      >
        <option value="">Select Condition</option>
        {filterOptions.Condition.map((condition, index) => (
          <option key={index} value={condition}>
            {condition}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterOptions;
