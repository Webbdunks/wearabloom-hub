
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Product } from '@/types';
import { products as initialProductsData } from '@/data/products';
import { toast } from 'sonner';

type ProductContextType = {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  isLoading: boolean;
  error: string | null;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// LocalStorage key for products
const STORAGE_KEY = 'ecommerce_products';

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products from localStorage or use initial data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Try to get products from localStorage first
        const storedProducts = localStorage.getItem(STORAGE_KEY);
        
        if (storedProducts) {
          // Use stored products if available
          setProducts(JSON.parse(storedProducts));
          console.log('Products loaded from localStorage');
        } else {
          // Initialize with default products if none in storage
          setProducts(initialProductsData);
          // Save initial products to localStorage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProductsData));
          console.log('Initial products saved to localStorage');
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products');
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (!isLoading && products.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      console.log('Products saved to localStorage');
    }
  }, [products, isLoading]);

  const addProduct = (productData: Omit<Product, 'id'>) => {
    try {
      const newProduct: Product = {
        ...productData,
        id: crypto.randomUUID(),
      };

      setProducts(prevProducts => [...prevProducts, newProduct]);
      toast.success('Product added successfully');
      return newProduct;
    } catch (err) {
      toast.error('Failed to add product');
      throw err;
    }
  };

  const updateProduct = (updatedProduct: Product) => {
    try {
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );
      toast.success('Product updated successfully');
    } catch (err) {
      toast.error('Failed to update product');
      throw err;
    }
  };

  const deleteProduct = (id: string) => {
    try {
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      toast.success('Product deleted successfully');
    } catch (err) {
      toast.error('Failed to delete product');
      throw err;
    }
  };

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, isLoading, error }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
