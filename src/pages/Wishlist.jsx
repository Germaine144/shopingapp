import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart } = useContext(CartContext);

  const handleAddToCart = (product) => {
    addToCart(product);
    // Optionally remove from wishlist after adding to cart
    // toggleWishlist(product);
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Save your favorite items to your wishlist and shop them later!
              </p>
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to shopping
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-1">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Product Image */}
              <div className="relative bg-gray-50 aspect-square overflow-hidden">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Remove Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>

                {/* Discount Badge */}
                {product.discountPercentage && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-black text-white text-xs font-medium px-3 py-1 rounded-full">
                      -{Math.round(product.discountPercentage)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5">
                {/* Category */}
                <div className="mb-3">
                  <span className="inline-block text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2">
                  {product.title}
                </h3>

                {/* Rating and Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-amber-500 text-sm mr-1">★</span>
                    <span className="text-sm font-medium text-gray-700">
                      {product.rating?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                  <div className="font-bold text-xl text-gray-900">
                    ${product.price}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-full text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 border-2 border-gray-900 text-gray-900 font-medium rounded-full hover:bg-gray-900 hover:text-white transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;