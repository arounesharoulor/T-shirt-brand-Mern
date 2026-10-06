import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size, quantity = 1) => {
    setCartItems(prev => {
      // Check if item with same ID and size exists
      const existingItem = prev.find(item => item.product._id === product._id && item.size === size);
      
      if (existingItem) {
        return prev.map(item => 
          item.product._id === product._id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prev, { product, size, quantity }];
    });
    
    // Auto open cart drawer when adding item (optional, we can just let badge update)
    // setIsCartOpen(true);
  };

  const removeFromCart = (productId, size) => {
    setCartItems(prev => prev.filter(item => !(item.product._id === productId && item.size === size)));
  };

  const updateQuantity = (productId, size, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => 
      item.product._id === productId && item.size === size 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, getCartCount, clearCart, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
