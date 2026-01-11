import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { ShoppingBag, Search, Heart, User, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart, getCartItemCount } = useContext(CartContext);
  const { user, isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Get cart count - handle if function doesn't exist
  const cartItemCount = getCartItemCount ? getCartItemCount() : cart?.length || 0;
  
  // Wishlist count - if you have wishlist in CartContext, otherwise set to 0
  // const wishlistCount = wishlist?.length || 0;

  const handleCartClick = () => {
    if (!isLoggedIn) {
      // Redirect to login if not authenticated
      navigate('/login');
      // You could also show a toast message here
    } else {
      navigate('/cart');
    }
  };

  const handleWishlistClick = () => {
    if (!isLoggedIn) {
      // Redirect to login if not authenticated
      navigate('/login');
      // You could also show a toast message here
    } else {
      navigate('/wishlist');
    }
  };

  const handleAccountClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Shop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-12">
            <Link 
              to="/" 
              className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Products
            </Link>
            <Link 
              to="/categories" 
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Categories
            </Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <button 
              onClick={() => navigate('/products')}
              className="p-2.5 hover:bg-gray-50 rounded-full transition-colors"
              title="Search products"
            >
              <Search className="w-5 h-5 text-gray-700" />
            </button>

            {/* Wishlist */}
            <button 
              onClick={handleWishlistClick}
              className="p-2.5 hover:bg-gray-50 rounded-full transition-colors relative group"
              title={!isLoggedIn ? "Login to view wishlist" : "View wishlist"}
            >
              <Heart className="w-5 h-5 text-gray-700 group-hover:text-red-500 transition-colors" />
              {/* Uncomment when wishlist is implemented
              {isLoggedIn && wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
              */}
              {!isLoggedIn && (
                <span className="absolute -bottom-8 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Login required
                </span>
              )}
            </button>

            {/* Cart */}
            <button 
              onClick={handleCartClick}
              className="p-2.5 hover:bg-gray-50 rounded-full transition-colors relative group"
              title={!isLoggedIn ? "Login to view cart" : "View cart"}
            >
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
              {!isLoggedIn && (
                <span className="absolute -bottom-8 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Login required
                </span>
              )}
            </button>

            {/* Account / Sign In */}
            {isLoggedIn && user ? (
              <div className="hidden lg:flex items-center space-x-3 ml-2">
                <button
                  onClick={handleAccountClick}
                  className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {(user.firstName || user.username || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.firstName || user.username}
                  </span>
                </button>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="hidden lg:flex ml-2 px-6 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-6 py-4">
            <div className="flex flex-col space-y-1">
              <Link 
                to="/" 
                className="px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                to="/categories" 
                className="px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
            </div>
            
            <div className="pt-4 mt-4 border-t border-gray-100">
              {isLoggedIn && user ? (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      navigate('/dashboard');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg flex items-center transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">
                        {(user.firstName || user.username || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{user.firstName || user.username}</div>
                      <div className="text-xs text-gray-500">View Account</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={handleCartClick}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center">
                      <ShoppingBag className="w-5 h-5 mr-3 text-gray-600" />
                      <span>Shopping Cart</span>
                    </div>
                    {cartItemCount > 0 && (
                      <span className="bg-black text-white text-xs font-medium px-2 py-1 rounded-full">
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                  
                  <button
                    onClick={handleWishlistClick}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg flex items-center transition-colors"
                  >
                    <Heart className="w-5 h-5 mr-3 text-gray-600" />
                    <span>Wishlist</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 mt-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;