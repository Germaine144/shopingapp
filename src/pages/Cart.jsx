import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

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

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="text-gray-400 text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some products to your cart to continue shopping.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/products" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Browse Products
            </Link>
            <Link 
              to="/" 
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 font-medium"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Cart Header */}
              <div className="hidden md:grid grid-cols-12 bg-gray-50 px-6 py-3 border-b border-gray-200 text-sm font-medium text-gray-600">
                <div className="col-span-5">Product</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-3">Quantity</div>
                <div className="col-span-2">Total</div>
              </div>
              
              {/* Cart Items */}
              <div className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.selectedSize || ''}-${item.selectedColor || ''}`} 
                       className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center">
                      {/* Product Image and Info */}
                      <div className="flex items-start space-x-4 md:w-5/12 mb-4 md:mb-0">
                        <img 
                          src={item.thumbnail} 
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div>
                          <Link to={`/product/${item.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                            {item.title}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                          {item.selectedSize && (
                            <p className="text-sm text-gray-500">Size: {item.selectedSize}</p>
                          )}
                          {item.selectedColor && (
                            <p className="text-sm text-gray-500">Color: {item.selectedColor}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="md:w-2/12 mb-4 md:mb-0">
                        <span className="font-medium text-gray-900">${item.price.toFixed(2)}</span>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="md:w-3/12 mb-4 md:mb-0">
                        <div className="flex items-center">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l hover:bg-gray-100"
                          >
                            -
                          </button>
                          <input 
                            type="number" 
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-12 h-8 text-center border-t border-b border-gray-300"
                          />
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      {/* Total and Remove */}
                      <div className="md:w-2/12 flex justify-between items-center">
                        <span className="font-bold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Cart Actions */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex justify-between">
                  <button 
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Clear Cart
                  </button>
                  <Link 
                    to="/products" 
                    className="text-blue-600 hover:text-blue-800 font-medium"
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
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {calculateSubtotal() > 100 ? 'FREE' : '$10.00'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-medium">${(calculateSubtotal() * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg mb-4 transition-all"
              >
                Proceed to Checkout
              </button>
              
              <div className="text-center text-sm text-gray-500">
                <p>Free shipping on orders over $100</p>
              </div>
            </div>
            
            {/* Promo Code */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Apply Promo Code</h3>
              <div className="flex">
                <input 
                  type="text" 
                  placeholder="Enter promo code"
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-gray-800 text-white px-4 py-2 rounded-r-lg hover:bg-gray-900">
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;