
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

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real application, this would fetch from an API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setProducts(initialProductsData);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load products');
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addProduct = (productData: Omit<Product, 'id'>) => {
    try {
      const newProduct: Product = {
        ...productData,
        id: crypto.randomUUID(),
      };

      // In a real application, this would be an API call
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
      // In a real application, this would be an API call
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
      // In a real application, this would be an API call
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
