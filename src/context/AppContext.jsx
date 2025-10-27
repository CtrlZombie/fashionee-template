/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('shop');
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Функция для обновления счётчика избранного
  const updateFavoritesCount = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavoritesCount(favorites.length);
  };

  // Функция для обновления счётчика корзины
  const updateCartCount = () => {
    const cartData = localStorage.getItem('cart');
    
    if (!cartData) {
      setCartCount(0);
      return;
    }

    try {
      const cart = JSON.parse(cartData);
      
      // Обрабатываем оба формата: массив и объект
      let totalItems = 0;
      
      if (Array.isArray(cart)) {
        // Новый формат: массив объектов [{id, quantity}]
        totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      } else if (typeof cart === 'object' && cart !== null) {
        // Старый формат: объект {productId: quantity}
        totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
      }
      
      setCartCount(totalItems);
    } catch (error) {
      console.error('Error parsing cart data:', error);
      setCartCount(0);
    }
  };

  // Загрузка избранного и корзины при запуске
  useEffect(() => {
    updateFavoritesCount();
    updateCartCount();
  }, []);

  const value = {
    currentPage,
    setCurrentPage,
    cartCount,
    setCartCount,
    favoritesCount,
    setFavoritesCount,
    updateFavoritesCount,
    updateCartCount
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};