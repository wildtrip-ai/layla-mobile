import { useState, useEffect, useCallback } from "react";

export interface RecentlyViewedItem {
  countrySlug: string;
  destinationId: string;
  name: string;
  image: string;
  countryName: string;
  countryFlag: string;
  viewedAt: number;
}

const STORAGE_KEY = 'recentlyViewed';
const MAX_ITEMS = 10;

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      setItems([]);
    }
  }, []);

  const addItem = useCallback((item: Omit<RecentlyViewedItem, 'viewedAt'>) => {
    setItems(prev => {
      // Remove existing entry for this destination
      const filtered = prev.filter(
        i => !(i.countrySlug === item.countrySlug && i.destinationId === item.destinationId)
      );
      
      // Add new item at the beginning
      const newItem: RecentlyViewedItem = {
        ...item,
        viewedAt: Date.now(),
      };
      
      const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);
      
      // Persist to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Storage full or unavailable
      }
      
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore errors
    }
  }, []);

  return {
    items,
    addItem,
    clearAll,
    hasItems: items.length > 0,
  };
}
