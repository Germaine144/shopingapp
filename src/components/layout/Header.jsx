import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { ShoppingBag, Search, Heart, User, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart, wishlist, getCartCount } = useContext(CartContext);
  const { user, isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const cartItemCount = getCartCount();
  const wishlistCount = wishlist.length;

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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-3xl font-bold tracking-tight">Shop</span>
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
            <button className="p-2.5 hover:bg-gray-50 rounded-full transition-colors">
              <Search className="w-5 h-5 text-gray-700" />
            </button>

            {/* Wishlist */}
            <button 
              onClick={handleWishlistClick}
              className="p-2.5 hover:bg-gray-50 rounded-full transition-colors relative group"
              title={!isLoggedIn ? "Login to view wishlist" : "View wishlist"}
            >
              <Heart className={`w-5 h-5 ${isLoggedIn && wishlistCount > 0 ? 'text-red-500 fill-red-500' : 'text-gray-700'}`} />
              {isLoggedIn && wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
              {!isLoggedIn && (
                <span className="absolute -bottom-8 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
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
              {isLoggedIn && cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
              {!isLoggedIn && (
                <span className="absolute -bottom-8 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
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
                  <User className="w-4 h-4 text-gray-700" />
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
                className="hidden lg:flex ml-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
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
        <div className="lg:hidden bg-white border-t border-gray-100 px-6 py-4">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-sm font-medium text-gray-900"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="text-sm font-medium text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link 
              to="/categories" 
              className="text-sm font-medium text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            
            <div className="pt-4 border-t border-gray-100">
              {isLoggedIn && user ? (
                <>
                  <button
                    onClick={() => {
                      navigate('/dashboard');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg flex items-center"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {user.firstName || user.username}'s Account
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 mt-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 bg-black text-white text-sm font-medium rounded-full"
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