import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Heart, User, Menu, ChevronRight } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';
import { api } from '../api/axiosInstance';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch categories
    api.getCategories()
      .then(res => setCategories(res.data || []))
      .catch(() => setCategories([]));

    // Fetch products
    api.getAllProducts()
      .then(res => {
        const allProducts = res.data.products || [];
        setProducts(allProducts.slice(0, 9));
        setFeaturedProducts(allProducts.slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const sidebarCategories = [
    'Air Product',
    'FireTower',
    'FireMode',
    'FireTrace',
    'FireStorage',
    'SmartGrid',
    'Start Solar',
    'GoBrowser'
  ];

  return (
    <div className="min-h-screen bg-white">
    

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-[1400px] mx-auto px-6 py-16 lg:py-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Give All You Need
            </h1>
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search of product"
                className="w-full px-6 py-4 rounded-full bg-gray-50 border-none focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors text-sm font-medium">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            {/* Category Sidebar */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Category</h2>
              <ul className="space-y-1">
                {sidebarCategories.map((category, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 group transition-colors text-sm"
                    >
                      <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                        {category}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ad Banner */}
            <div className="hidden lg:block bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl p-6 text-white">
              <h3 className="text-sm font-medium mb-2 opacity-90">Ready to Get</h3>
              <h2 className="text-2xl font-bold mb-4 leading-tight">
                Our New Stuff?
              </h2>
              <p className="text-sm opacity-75 mb-6">
                Stuffed with many new Goods
              </p>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Your Mail"
                  className="w-full px-4 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
                />
                <button className="w-full px-4 py-2.5 bg-white text-gray-900 rounded-full font-medium text-sm hover:bg-gray-100 transition-colors">
                  Send
                </button>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Shop</h2>
                <div className="flex items-center space-x-3 text-sm">
                  <span className="text-gray-600">Other</span>
                  <span className="text-gray-600">Detail</span>
                  <span className="text-gray-600">Match</span>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-100 animate-pulse rounded-2xl h-96"
                    ></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-center space-x-2 mt-10">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-gray-600">←</span>
                </button>
                {[1, 2, 3, 4, 5, 6, 7].map(num => (
                  <button
                    key={num}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      num === 1
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-gray-600">→</span>
                </button>
              </div>
            </div>

            {/* Explore Recommendations */}
            <div className="mt-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Explore our recommendations
                </h2>
                <a
                  href="#"
                  className="text-sm font-medium text-gray-900 hover:text-gray-600 flex items-center transition-colors"
                >
                  See All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map(product => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="inline-block text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full mb-2">
                          Other
                        </span>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {product.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="text-amber-500 text-sm mr-1">★</span>
                          <span className="text-sm font-medium text-gray-700">
                            {product.rating.toFixed(1)} Reviews
                          </span>
                        </div>
                        <div className="font-bold text-xl text-gray-900">
                          ${product.price}
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors">
                        Add to Chart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;