import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, wishlist } = useContext(CartContext);
  const { isLoggedIn } = useContext(AuthContext);
  const { success, error, info } = useToast();
  const navigate = useNavigate();
  
  // ✅ FIXED: Safety check for undefined wishlist
  const isWishlisted = wishlist?.some(item => item.id === product.id) || false;

  const handleAddToCart = (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      info('Please login to add items to cart');
      navigate('/login');
      return;
    }

    addToCart(product);
    success(`${product.title} added to cart!`);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      info('Please login to add items to wishlist');
      navigate('/login');
      return;
    }

    // Check if toggleWishlist function exists
    if (toggleWishlist) {
      toggleWishlist(product);
      
      if (isWishlisted) {
        info(`${product.title} removed from wishlist`);
      } else {
        success(`${product.title} added to wishlist!`);
      }
    } else {
      // If toggleWishlist doesn't exist, show info
      info('Wishlist feature is not available yet');
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Product Image */}
      <div className="relative bg-gray-50 aspect-square overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
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
        {/* Category Tag */}
        <div className="mb-3">
          <span className="inline-block text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Product Title */}
        <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-1">
          {product.title}
        </h3>

        {/* Rating and Price Row */}
        <div className="flex items-center justify-between mb-4">
          {/* Rating */}
          <div className="flex items-center">
            <span className="text-amber-500 text-sm mr-1">★</span>
            <span className="text-sm font-medium text-gray-700">
              {product.rating?.toFixed(1) || '0.0'}
            </span>
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="font-bold text-xl text-gray-900">
              ${product.price}
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-full text-sm transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;