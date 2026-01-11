import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Plus, Minus, Trash2, ShoppingBag, X } from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08; // 8% tax
    return subtotal + shipping + tax;
  };

  // Helper function to create unique cart item identifier
  const getCartItemKey = (item) => {
    return `${item.id}-${item.selectedSize || ''}-${item.selectedColor || ''}`;
  };

  // Handle quantity increase
  const handleIncrease = (item) => {
    const newQuantity = item.quantity + 1;
    updateQuantity(item.id, newQuantity, item.selectedSize, item.selectedColor);
  };

  // Handle quantity decrease
  const handleDecrease = (item) => {
    const newQuantity = Math.max(1, item.quantity - 1);
    updateQuantity(item.id, newQuantity, item.selectedSize, item.selectedColor);
  };

  // Handle manual quantity input
  const handleQuantityInput = (item, value) => {
    const newQuantity = Math.max(1, parseInt(value) || 1);
    updateQuantity(item.id, newQuantity, item.selectedSize, item.selectedColor);
  };

  // Handle remove item
  const handleRemove = (item) => {
    removeFromCart(item.id, item.selectedSize, item.selectedColor);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some products to your cart to continue shopping.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/products" 
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 font-medium transition-colors"
            >
              Browse Products
            </Link>
            <Link 
              to="/" 
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <span className="text-gray-600">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Cart Header - Desktop */}
              <div className="hidden md:grid grid-cols-12 bg-gray-50 px-6 py-3 border-b border-gray-200 text-sm font-medium text-gray-600">
                <div className="col-span-5">Product</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-3">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              
              {/* Cart Items */}
              <div className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <div key={getCartItemKey(item)} 
                       className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-0 items-center">
                      {/* Product Image and Info */}
                      <div className="md:col-span-5 flex items-start space-x-4">
                        <img 
                          src={item.thumbnail} 
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <Link 
                            to={`/product/${item.id}`} 
                            className="font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
                          >
                            {item.title}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1 capitalize">{item.category}</p>
                          <div className="flex gap-3 mt-1">
                            {item.selectedSize && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                Size: {item.selectedSize}
                              </span>
                            )}
                            {item.selectedColor && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                Color: {item.selectedColor}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="md:col-span-2">
                        <div className="md:hidden text-sm text-gray-600 mb-1">Price</div>
                        <span className="font-medium text-gray-900">${item.price.toFixed(2)}</span>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="md:col-span-3">
                        <div className="md:hidden text-sm text-gray-600 mb-1">Quantity</div>
                        <div className="flex items-center">
                          <button 
                            onClick={() => handleDecrease(item)}
                            className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-l-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input 
                            type="number" 
                            value={item.quantity}
                            onChange={(e) => handleQuantityInput(item, e.target.value)}
                            min="1"
                            max="99"
                            className="w-14 h-9 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10"
                          />
                          <button 
                            onClick={() => handleIncrease(item)}
                            className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-r-lg hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Total and Remove */}
                      <div className="md:col-span-2 flex justify-between md:justify-end items-center gap-4">
                        <div>
                          <div className="md:hidden text-sm text-gray-600 mb-1">Total</div>
                          <span className="font-bold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        <button 
                          onClick={() => handleRemove(item)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Cart Actions */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <button 
                    onClick={clearCart}
                    className="flex items-center justify-center gap-2 text-red-600 hover:text-red-800 font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear Cart
                  </button>
                  <Link 
                    to="/products" 
                    className="flex items-center justify-center gap-2 text-gray-700 hover:text-gray-900 font-medium px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-medium text-gray-900">${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">
                    {calculateSubtotal() > 100 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      '$10.00'
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span className="font-medium text-gray-900">${(calculateSubtotal() * 0.08).toFixed(2)}</span>
                </div>
                
                {calculateSubtotal() < 100 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      Add ${(100 - calculateSubtotal()).toFixed(2)} more for free shipping!
                    </p>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (calculateSubtotal() / 100) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-2xl">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-lg mb-3 transition-all"
              >
                Proceed to Checkout
              </button>
              
              <div className="text-center text-xs text-gray-500">
                <p>Secure checkout • Free returns</p>
              </div>
            </div>
            
            {/* Promo Code */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Have a Promo Code?</h3>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter code"
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 font-medium transition-colors">
                  Apply
                </button>
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>30-Day Returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Free Shipping Over $100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;