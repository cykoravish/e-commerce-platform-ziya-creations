'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  slug?: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isInWishlist: (productId: string) => boolean;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('[v0] Failed to load wishlist:', error);
      }
    }
    setMounted(true);
  }, []);

  // Save to localStorage when items change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('wishlist', JSON.stringify(items));
    }
  }, [items, mounted]);

  const addItem = (item: WishlistItem) => {
    setItems((prevItems) => {
      const exists = prevItems.some((i) => i.productId === item.productId);
      if (!exists) {
        return [...prevItems, item];
      }
      return prevItems;
    });
  };

  const removeItem = (productId: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.productId !== productId));
  };

  const toggleItem = (item: WishlistItem) => {
    if (isInWishlist(item.productId)) {
      removeItem(item.productId);
    } else {
      addItem(item);
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some((i) => i.productId === productId);
  };

  const itemCount = items.length;

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        toggleItem,
        isInWishlist,
        itemCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
