import React, { createContext, useState, useContext, useEffect } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD');
  const exchangeRate = 83.5; // Example rate: 1 USD = 83.5 INR

  useEffect(() => {
    // Automatically detect location and set currency
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.country_code === 'IN') {
          setCurrency('INR');
        } else {
          setCurrency('USD');
        }
      })
      .catch(err => {
        console.log('Location detection failed, defaulting to USD');
      });
  }, []);

  const formatPrice = (priceInUSD) => {
    if (currency === 'INR') {
      return `₹${Math.round(priceInUSD * exchangeRate).toLocaleString('en-IN')}`;
    }
    return `$${priceInUSD.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
