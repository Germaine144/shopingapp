import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import { api } from '../api/axiosInstance';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (query) {
      setLoading(true);
      api.searchProducts(query)
        .then(res => {
          setProducts(res.data.products || []);
          setTotal(res.data.total || 0);
          setLoading(false);
        })
        .catch(() => {
          setProducts([]);
          setLoading(false);
        });
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-600">
            Found {total} product{total !== 1 ? 's' : ''} matching your search
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Results Found</h2>
            <p className="text-gray-600 mb-6">Try different keywords or browse our categories.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/products" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Browse All Products
              </Link>
              <Link 
                to="/" 
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Search Suggestions */}
            <div className="bg-gray-50 rounded-xl p-6 mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Suggestions</h3>
              <div className="flex flex-wrap gap-2">
                {['Phone', 'Laptop', 'Watch', 'Shoes', 'Beauty', 'Furniture'].map((suggestion) => (
                  <Link 
                    key={suggestion}
                    to={`/search?q=${suggestion}`}
                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 hover:border-blue-500"
                  >
                    {suggestion}
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;