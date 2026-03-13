import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export interface CartItem {
  id: string;
  title: string;
  price: string;
  priceNumber: number;
  image: string | null | undefined;
  quantity: number;
}

const CART_KEY = '@cart_storage';

export default function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load cart from storage on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const data = await AsyncStorage.getItem(CART_KEY);
      setCart(data ? JSON.parse(data) : []);
    } catch (e) {
      console.warn('Failed to load cart', e);
    } finally {
      setLoaded(true);
    }
  };

  const saveCart = async (items: CartItem[]) => {
    try {
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(items));
      setCart(items);
    } catch (e) {
      console.warn('Failed to save cart', e);
    }
  };

  const addItem = (product: { id: string; title: string; price: string; priceNumber: number; image: string | null | undefined }, qty: number) => {
    const existing = cart.find(i => i.id === product.id);
    let updated: CartItem[];
    if (existing) {
      updated = cart.map(i => (i.id === product.id ? { ...i, quantity: i.quantity + qty } : i));
    } else {
      updated = [...cart, { ...product, quantity: qty }];
    }
    saveCart(updated);
  };

  const removeItem = (id: string) => {
    const updated = cart.filter(i => i.id !== id);
    saveCart(updated);
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    const updated = cart.map(i => (i.id === id ? { ...i, quantity: qty } : i));
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.priceNumber * item.quantity, 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return { cart, loaded, addItem, removeItem, updateQuantity, clearCart, total, count };
}
