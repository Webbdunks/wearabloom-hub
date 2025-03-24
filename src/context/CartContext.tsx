
import React, { createContext, useState, useContext, useEffect } from "react";
import { Product } from "../types";
import { toast } from "sonner";

export type CartItem = {
  product: Product;
  quantity: number;
  size: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, quantity: number, size: string) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity: number, size: string) => {
    setItems(currentItems => {
      // Check if item already exists in cart with same size
      const existingItemIndex = currentItems.findIndex(
        item => item.product.id === product.id && item.size === size
      );

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const newItems = [...currentItems];
        newItems[existingItemIndex].quantity += quantity;
        toast.success(`Updated ${product.name} quantity in cart`);
        return newItems;
      } else {
        // Add new item
        toast.success(`Added ${product.name} to cart`);
        return [...currentItems, { product, quantity, size }];
      }
    });
  };

  const removeItem = (productId: string, size: string) => {
    setItems(currentItems => {
      const itemToRemove = currentItems.find(
        item => item.product.id === productId && item.size === size
      );
      
      if (itemToRemove) {
        toast.info(`Removed ${itemToRemove.product.name} from cart`);
      }
      
      return currentItems.filter(
        item => !(item.product.id === productId && item.size === size)
      );
    });
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size);
      return;
    }

    setItems(currentItems => {
      return currentItems.map(item => {
        if (item.product.id === productId && item.size === size) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  // Calculate subtotal
  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // Calculate total items
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      subtotal,
      totalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
