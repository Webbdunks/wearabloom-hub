
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Product } from '@/types';
import { products as initialProductsData } from '@/data/products';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

  // Load products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        
        // Check if products exist in Supabase
        const { data: existingProducts, error: countError } = await supabase
          .from('products')
          .select('*');
          
        if (countError) {
          throw countError;
        }
        
        // If no products in Supabase yet, seed with initial data
        if (existingProducts.length === 0) {
          // Insert initial products into Supabase
          for (const product of initialProductsData) {
            const { error: insertError } = await supabase
              .from('products')
              .insert({
                id: product.id,
                name: product.name,
                price: product.price,
                description: product.description,
                image: product.image,
                category: product.category,
                sizes: product.sizes,
                featured: product.featured || false,
                new: product.new || false,
              });
              
            if (insertError) {
              console.error('Error seeding product:', insertError);
            }
          }
          
          // Fetch products again after seeding
          const { data: seededProducts, error: fetchError } = await supabase
            .from('products')
            .select('*');
            
          if (fetchError) {
            throw fetchError;
          }
          
          setProducts(seededProducts as Product[]);
        } else {
          // Use existing products from Supabase
          setProducts(existingProducts as Product[]);
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

  // Set up realtime subscription for product changes
  useEffect(() => {
    const channel = supabase
      .channel('product-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' }, 
        (payload) => {
          console.log('Change received!', payload);
          // Reload products when changes occur
          supabase
            .from('products')
            .select('*')
            .then(({ data }) => {
              if (data) {
                setProducts(data as Product[]);
              }
            });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      setProducts(prevProducts => [...prevProducts, data as Product]);
      toast.success('Product added successfully');
      setIsLoading(false);
      
      return data;
    } catch (err: any) {
      toast.error(`Failed to add product: ${err.message}`);
      setIsLoading(false);
      throw err;
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('products')
        .update({
          name: updatedProduct.name,
          price: updatedProduct.price,
          description: updatedProduct.description,
          image: updatedProduct.image,
          category: updatedProduct.category,
          sizes: updatedProduct.sizes,
          featured: updatedProduct.featured || false,
          new: updatedProduct.new || false,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedProduct.id);
        
      if (error) {
        throw error;
      }
      
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );
      
      toast.success('Product updated successfully');
      setIsLoading(false);
    } catch (err: any) {
      toast.error(`Failed to update product: ${err.message}`);
      setIsLoading(false);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      toast.success('Product deleted successfully');
      setIsLoading(false);
    } catch (err: any) {
      toast.error(`Failed to delete product: ${err.message}`);
      setIsLoading(false);
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
