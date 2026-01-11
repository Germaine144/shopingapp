import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="font-bold">O</span>
              </div>
              <span className="text-xl font-bold">OneAllYouNeed</span>
            </div>
            <p className="text-gray-400">
              Your one-stop shop for all premium products. Quality guaranteed.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white">Products</Link></li>
              <li><Link to="/categories" className="text-gray-400 hover:text-white">Categories</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
              <li><Link to="/shipping" className="text-gray-400 hover:text-white">Shipping Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe to get special offers</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-grow px-4 py-2 rounded-l-lg text-gray-900 focus:outline-none"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} OneAllYouNeed. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;