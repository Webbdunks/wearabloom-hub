
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

  // Load products from Supabase or use initial data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        
        // Fetch products from Supabase
        const { data, error } = await supabase
          .from('products')
          .select('*');
          
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          // Transform Supabase data to match Product type
          const formattedProducts: Product[] = data.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.description || "",
            image: item.image || "",
            category: item.category || "",
            featured: item.featured || false,
            new: item.new || false,
            sizes: item.sizes || [],
            colors: [], // Assuming colors not in DB yet
          }));
          
          setProducts(formattedProducts);
          console.log('Products loaded from Supabase');
        } else {
          // If no products in Supabase, use initial data
          setProducts(initialProductsData);
          
          // Optionally seed the database with initial data
          const seedDatabase = async () => {
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
                  featured: product.featured,
                  new: product.new,
                  sizes: product.sizes,
                });
                
              if (insertError) {
                console.error('Error seeding product:', insertError);
              }
            }
            console.log('Initial products seeded to Supabase');
          };
          
          seedDatabase();
        }
      } catch (err: any) {
        console.error('Error loading products:', err);
        setError(err.message || 'Failed to load products');
        // Fallback to initial data
        setProducts(initialProductsData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      setIsLoading(true);
      
      // Insert product into Supabase
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          price: productData.price,
          description: productData.description,
          image: productData.image,
          category: productData.category,
          featured: productData.featured,
          new: productData.new,
          sizes: productData.sizes,
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Transform to match Product type
      const newProduct: Product = {
        id: data.id,
        name: data.name,
        price: data.price,
        description: data.description || "",
        image: data.image || "",
        category: data.category || "",
        featured: data.featured || false,
        new: data.new || false,
        sizes: data.sizes || [],
        colors: productData.colors || [],
      };
      
      // Update local state
      setProducts(prevProducts => [...prevProducts, newProduct]);
      toast.success('Product added successfully');
      return newProduct;
    } catch (err: any) {
      toast.error('Failed to add product: ' + err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    try {
      setIsLoading(true);
      
      // Update product in Supabase
      const { error } = await supabase
        .from('products')
        .update({
          name: updatedProduct.name,
          price: updatedProduct.price,
          description: updatedProduct.description,
          image: updatedProduct.image,
          category: updatedProduct.category,
          featured: updatedProduct.featured,
          new: updatedProduct.new,
          sizes: updatedProduct.sizes,
        })
        .eq('id', updatedProduct.id);
        
      if (error) throw error;
      
      // Update local state
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );
      
      toast.success('Product updated successfully');
    } catch (err: any) {
      toast.error('Failed to update product: ' + err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setIsLoading(true);
      
      // Delete product from Supabase
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      toast.success('Product deleted successfully');
    } catch (err: any) {
      toast.error('Failed to delete product: ' + err.message);
      throw err;
    } finally {
      setIsLoading(false);
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
