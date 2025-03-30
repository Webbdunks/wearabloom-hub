
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Order, OrderStatus } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

type OrderContextType = {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  createOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<Order>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  getAllOrders: () => Promise<Order[]>;
  getUserOrders: (userId: string) => Promise<Order[]>;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load user's orders on mount if user is logged in
  useEffect(() => {
    if (user) {
      const loadUserOrders = async () => {
        try {
          setIsLoading(true);
          const userOrders = await getUserOrders(user.id);
          setOrders(userOrders);
        } catch (err: any) {
          console.error('Error loading user orders:', err);
          setError(err.message || 'Failed to load orders');
        } finally {
          setIsLoading(false);
        }
      };

      loadUserOrders();
    }
  }, [user]);

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
    try {
      setIsLoading(true);
      
      // Insert order into Supabase
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: orderData.userId,
          customer_name: orderData.customerName,
          email: orderData.email,
          items: orderData.items,
          status: orderData.status,
          shipping_address: orderData.shippingAddress,
          total: orderData.total
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Transform to match Order type
      const newOrder: Order = {
        id: data.id,
        userId: data.user_id,
        customerName: data.customer_name,
        email: data.email,
        items: data.items,
        status: data.status,
        shippingAddress: data.shipping_address,
        total: data.total,
        createdAt: data.created_at
      };
      
      // Update local state
      setOrders(prevOrders => [...prevOrders, newOrder]);
      
      toast.success('Order created successfully');
      return newOrder;
    } catch (err: any) {
      console.error('Failed to create order:', err);
      toast.error('Failed to create order');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: OrderStatus): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Update order in Supabase
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === id ? { ...order, status } : order
        )
      );
      
      toast.success(`Order status updated to ${status}`);
    } catch (err: any) {
      console.error('Failed to update order status:', err);
      toast.error('Failed to update order status');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getAllOrders = async (): Promise<Order[]> => {
    try {
      setIsLoading(true);
      
      // Fetch all orders from Supabase (admin only)
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform to match Order type
      const allOrders: Order[] = data.map(item => ({
        id: item.id,
        userId: item.user_id,
        customerName: item.customer_name,
        email: item.email,
        items: item.items,
        status: item.status,
        shippingAddress: item.shipping_address,
        total: item.total,
        createdAt: item.created_at
      }));
      
      return allOrders;
    } catch (err: any) {
      console.error('Failed to fetch all orders:', err);
      setError(err.message || 'Failed to fetch orders');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserOrders = async (userId: string): Promise<Order[]> => {
    try {
      setIsLoading(true);
      
      // Fetch user orders from Supabase
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform to match Order type
      const userOrders: Order[] = data.map(item => ({
        id: item.id,
        userId: item.user_id,
        customerName: item.customer_name,
        email: item.email,
        items: item.items,
        status: item.status,
        shippingAddress: item.shipping_address,
        total: item.total,
        createdAt: item.created_at
      }));
      
      return userOrders;
    } catch (err: any) {
      console.error('Failed to fetch user orders:', err);
      setError(err.message || 'Failed to fetch orders');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        isLoading,
        error,
        createOrder,
        updateOrderStatus,
        getAllOrders,
        getUserOrders
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
