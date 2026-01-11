import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import ProductFilters from '../components/products/ProductFilters';
import { api } from '../api/axiosInstance';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    limit: 12,
    skip: 0,
    total: 0
  });
  
  const initialFilter = {
    category: searchParams.get('category') || '',
    sortBy: searchParams.get('sortBy') || 'title',
    order: searchParams.get('order') || 'asc',
    q: searchParams.get('q') || '',
    select: 'title,price,thumbnail,rating,category,discountPercentage'
  };

  const [filter, setFilter] = useState(initialFilter);

  useEffect(() => {
    fetchProducts();
  }, [filter, pagination.skip]);

  const fetchProducts = () => {
    setLoading(true);
    
    const params = {
      limit: pagination.limit,
      skip: pagination.skip,
      ...filter
    };

    let apiCall;
    
    if (filter.q) {
      apiCall = api.searchProducts(filter.q, params);
    } else if (filter.category) {
      apiCall = api.getProductsByCategory(filter.category, params);
    } else {
      apiCall = api.getAllProducts(params);
    }

    apiCall
      .then(res => {
        setProducts(res.data.products || []);
        setPagination(prev => ({
          ...prev,
          total: res.data.total || 0
        }));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setProducts([]);
      });
  };

  const handleFilterChange = (newFilter) => {
    const updatedFilter = { ...filter, ...newFilter, skip: 0 };
    setFilter(updatedFilter);
    
    // Update URL params
    const params = {};
    if (updatedFilter.category) params.category = updatedFilter.category;
    if (updatedFilter.sortBy !== 'title') params.sortBy = updatedFilter.sortBy;
    if (updatedFilter.order !== 'asc') params.order = updatedFilter.order;
    if (updatedFilter.q) params.q = updatedFilter.q;
    
    setSearchParams(params);
    
    // Reset pagination
    setPagination(prev => ({ ...prev, skip: 0 }));
  };

  const handlePageChange = (direction) => {
    setPagination(prev => ({
      ...prev,
      skip: direction === 'next' 
        ? Math.min(prev.skip + prev.limit, prev.total - prev.limit)
        : Math.max(prev.skip - prev.limit, 0)
    }));
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {filter.q ? `Search: "${filter.q}"` : 'All Products'}
          </h1>
          <p className="text-gray-600">
            {filter.category 
              ? `Products in ${filter.category}` 
              : 'Browse our complete collection'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <ProductFilters 
              onFilterChange={handleFilterChange}
              selectedCategory={filter.category}
              sortConfig={filter}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Search Info */}
            {filter.q && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">
                  Found {pagination.total} products for "{filter.q}"
                </p>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <>
                {/* Product Count and Sort */}
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">
                    Showing {pagination.skip + 1}-{Math.min(pagination.skip + pagination.limit, pagination.total)} of {pagination.total} products
                  </p>
                  <select 
                    value={`${filter.sortBy}-${filter.order}`}
                    onChange={(e) => {
                      const [sortBy, order] = e.target.value.split('-');
                      handleFilterChange({ sortBy, order });
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                  >
                    <option value="title-asc">Sort: A to Z</option>
                    <option value="title-desc">Sort: Z to A</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating-desc">Highest Rated</option>
                  </select>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.total > pagination.limit && (
                  <div className="flex justify-center items-center space-x-4 mt-8">
                    <button
                      onClick={() => handlePageChange('prev')}
                      disabled={pagination.skip === 0}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    <span className="text-gray-600">
                      Page {Math.floor(pagination.skip / pagination.limit) + 1} of {Math.ceil(pagination.total / pagination.limit)}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange('next')}
                      disabled={pagination.skip + pagination.limit >= pagination.total}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;