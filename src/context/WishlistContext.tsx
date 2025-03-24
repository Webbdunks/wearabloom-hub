
import React, { createContext, useState, useContext, useEffect } from "react";
import { Product } from "../types";
import { toast } from "sonner";

type WishlistContextType = {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  totalItems: number;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);
  
  // Load wishlist from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error("Failed to parse wishlist from localStorage:", error);
      }
    }
  }, []);
  
  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product) => {
    setItems(currentItems => {
      // Check if item already exists in wishlist
      const exists = currentItems.some(item => item.id === product.id);

      if (exists) {
        return currentItems;
      } else {
        // Add new item
        toast.success(`Added ${product.name} to wishlist`);
        return [...currentItems, product];
      }
    });
  };

  const removeItem = (productId: string) => {
    setItems(currentItems => {
      const itemToRemove = currentItems.find(item => item.id === productId);
      
      if (itemToRemove) {
        toast.info(`Removed ${itemToRemove.name} from wishlist`);
      }
      
      return currentItems.filter(item => item.id !== productId);
    });
  };

  const isInWishlist = (productId: string): boolean => {
    return items.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  // Calculate total items
  const totalItems = items.length;

  return (
    <WishlistContext.Provider value={{
      items,
      addItem,
      removeItem,
      isInWishlist,
      clearWishlist,
      totalItems
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
