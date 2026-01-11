import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
        setCart([]);
      }
    }
    
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error loading wishlist:', error);
        setWishlist([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Helper function to find cart item index
  const findCartItemIndex = (productId, selectedSize, selectedColor) => {
    return cart.findIndex(
      item =>
        item.id === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );
  };

  // Add item to cart
  const addToCart = (product, quantity = 1, selectedSize = null, selectedColor = null) => {
    const existingIndex = findCartItemIndex(product.id, selectedSize, selectedColor);

    if (existingIndex > -1) {
      // Item already exists, update quantity
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      // New item, add to cart
      const cartItem = {
        ...product,
        quantity,
        selectedSize,
        selectedColor,
        addedAt: new Date().toISOString(),
      };
      setCart([...cart, cartItem]);
    }
  };

  // Remove item from cart
  const removeFromCart = (productId, selectedSize = null, selectedColor = null) => {
    const updatedCart = cart.filter(
      item =>
        !(item.id === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor)
    );
    setCart(updatedCart);
  };

  // Update item quantity
  const updateQuantity = (productId, newQuantity, selectedSize = null, selectedColor = null) => {
    if (newQuantity < 1) {
      // If quantity is less than 1, remove the item
      removeFromCart(productId, selectedSize, selectedColor);
      return;
    }

    const itemIndex = findCartItemIndex(productId, selectedSize, selectedColor);
    
    if (itemIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[itemIndex].quantity = newQuantity;
      setCart(updatedCart);
    }
  };

  // Clear entire cart
  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setCart([]);
      localStorage.removeItem('cart');
    }
  };

  // Get cart item count
  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Get cart total
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Check if item is in cart
  const isInCart = (productId, selectedSize = null, selectedColor = null) => {
    return findCartItemIndex(productId, selectedSize, selectedColor) > -1;
  };

  // Get specific cart item
  const getCartItem = (productId, selectedSize = null, selectedColor = null) => {
    const index = findCartItemIndex(productId, selectedSize, selectedColor);
    return index > -1 ? cart[index] : null;
  };

  // ==================== WISHLIST FUNCTIONS ====================
  
  // Toggle item in wishlist
  const toggleWishlist = (product) => {
    const existingIndex = wishlist.findIndex(item => item.id === product.id);
    
    if (existingIndex > -1) {
      // Remove from wishlist
      const updatedWishlist = wishlist.filter(item => item.id !== product.id);
      setWishlist(updatedWishlist);
    } else {
      // Add to wishlist
      setWishlist([...wishlist, product]);
    }
  };

  // Add item to wishlist
  const addToWishlist = (product) => {
    if (!wishlist.some(item => item.id === product.id)) {
      setWishlist([...wishlist, product]);
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter(item => item.id !== productId);
    setWishlist(updatedWishlist);
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  // Clear wishlist
  const clearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      setWishlist([]);
      localStorage.removeItem('wishlist');
    }
  };

  const value = {
    cart,
    wishlist,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount,
    getCartTotal,
    isInCart,
    getCartItem,
    toggleWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};