import { useState, useCallback } from 'react';
import { CartItem, Service } from '../types';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((service: Service, quantity: number, selectedOptions: string[]) => {
    const optionsPrice = selectedOptions.reduce((total, optionId) => {
      const option = service.options?.find(opt => opt._id === optionId);
      return total + (option?.price || 0);
    }, 0);
    
    // const totalPrice = optionsPrice * quantity;
    
    // const newItem: CartItem = {
    //   serviceId: service._id,
    //   service,
    //   quantity,
    //   selectedOptions,
    //   totalPrice
    // };

    const unitPrice = optionsPrice;

const newItem: CartItem = {
  serviceId: service._id,
  service,
  quantity,
  selectedOptions,
  totalPrice: unitPrice * quantity,
  price: unitPrice,
  washermanId: service.washerman?._id || '', // fallback if washerman is populated or not
  washerman: service.washerman,
  name: service.name
};


    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(
        item => item.serviceId === service._id && 
        JSON.stringify(item.selectedOptions.sort()) === JSON.stringify(selectedOptions.sort())
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...prev];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
          totalPrice: updatedItems[existingItemIndex].totalPrice + totalPrice
        };
        return updatedItems;
      } else {
        return [...prev, newItem];
      }
    });
  }, []);

  const removeFromCart = useCallback((serviceId: string, selectedOptions: string[]) => {
    setCartItems(prev => prev.filter(
      item => !(item.serviceId === serviceId && 
      JSON.stringify(item.selectedOptions.sort()) === JSON.stringify(selectedOptions.sort()))
    ));
  }, []);

  const updateQuantity = useCallback((serviceId: string, selectedOptions: string[], newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(serviceId, selectedOptions);
      return;
    }

    setCartItems(prev => prev.map(item => {
      if (item.serviceId === serviceId && 
          JSON.stringify(item.selectedOptions.sort()) === JSON.stringify(selectedOptions.sort())) {
        const unitPrice = item.totalPrice / item.quantity;
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: unitPrice * newQuantity
        };
      }
      return item;
    }));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const getTotalAmount = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [cartItems]);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalAmount
  };
}