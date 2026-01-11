import React, { useState, useEffect } from 'react';
import { api } from '../../api/axiosInstance';

const ProductFilters = ({ onFilterChange, selectedCategory, sortConfig }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCategories()
      .then(res => {
        setCategories(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCategoryChange = (e) => {
    onFilterChange({ category: e.target.value });
  };

  const handleSortChange = (e) => {
    const [sortBy, order] = e.target.value.split('-');
    onFilterChange({ sortBy, order });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Filters</h3>
      
      <div className="space-y-6">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select 
            value={selectedCategory || ''}
            onChange={handleCategoryChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.slug || category} value={category.slug || category}>
                {category.name || category}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select 
            value={`${sortConfig.sortBy}-${sortConfig.order}`}
            onChange={handleSortChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="title-asc">Name: A to Z</option>
            <option value="title-desc">Name: Z to A</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Highest Rated</option>
            <option value="discountPercentage-desc">Biggest Discount</option>
          </select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="2000"
              step="10"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-600">$0 - $2000</span>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(selectedCategory || sortConfig.sortBy !== 'title' || sortConfig.order !== 'asc') && (
          <button
            onClick={() => onFilterChange({ category: '', sortBy: 'title', order: 'asc' })}
            className="w-full py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;