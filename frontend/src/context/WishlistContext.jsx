import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlistItems');
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const toggleWishlist = (product) => {
    setWishlistItems(prev => {
      const exists = prev.find(item => item._id === product._id);
      if (exists) {
        toast.success('Removed from Wishlist', { id: 'wishlist' });
        return prev.filter(item => item._id !== product._id);
      } else {
        toast.success('Added to Wishlist', { id: 'wishlist' });
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
