import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, isLoggedIn } = useContext(AuthContext);

  // Helper function to get storage key based on user
  const getStorageKey = (key) => {
    // If user is logged in, use user-specific keys, otherwise use guest keys
    return isLoggedIn && user?.id ? `${key}_user_${user.id}` : `${key}_guest`;
  };

  // Load initial data from localStorage
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem(getStorageKey('cart'));
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem(getStorageKey('wishlist'));
    return saved ? JSON.parse(saved) : [];
  });

  // Update storage keys when user logs in/out
  useEffect(() => {
    const newCartKey = getStorageKey('cart');
    const newWishlistKey = getStorageKey('wishlist');

    // Load user-specific cart and wishlist
    const savedCart = localStorage.getItem(newCartKey);
    const savedWishlist = localStorage.getItem(newWishlistKey);

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      setCart([]);
    }

    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    } else {
      setWishlist([]);
    }

    // If user logs out, clear guest data
    if (!isLoggedIn) {
      localStorage.removeItem('cart_guest');
      localStorage.removeItem('wishlist_guest');
    }
  }, [user?.id, isLoggedIn]);

  // Sync cart with localStorage whenever it changes
  useEffect(() => {
    const key = getStorageKey('cart');
    localStorage.setItem(key, JSON.stringify(cart));
  }, [cart, user?.id, isLoggedIn]);

  // Sync wishlist with localStorage whenever it changes
  useEffect(() => {
    const key = getStorageKey('wishlist');
    localStorage.setItem(key, JSON.stringify(wishlist));
  }, [wishlist, user?.id, isLoggedIn]);

  const addToCart = (product) => {
    setCart((prev) => {
      // Check if product already exists in cart
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        // If exists, increase quantity
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      
      // Add new item with quantity
      return [...prev, { ...product, quantity: 1, cartId: Date.now() }];
    });
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    
    setCart((prev) =>
      prev.map(item =>
        item.cartId === cartId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id); // Remove if exists
      }
      return [...prev, product]; // Add if not exists
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const quantity = item.quantity || 1;
      return total + (item.price * quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};