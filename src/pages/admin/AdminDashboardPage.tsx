
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageSearch, ClipboardList, BarChart3, Users } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/context/ProductContext';
import { useOrders } from '@/context/OrderContext';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { products, isLoading: productsLoading } = useProducts();
  const { getAllOrders, isLoading: ordersLoading } = useOrders();
  const [orders, setOrders] = useState<any[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  
  // Fetch orders data
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoadingOrders(true);
        const allOrders = await getAllOrders();
        setOrders(allOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoadingOrders(false);
      }
    };
    
    fetchOrders();
  }, [getAllOrders]);
  
  // Fetch user count
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        setIsLoadingUsers(true);
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        if (error) throw error;
        
        setUserCount(count || 0);
      } catch (error) {
        console.error('Error fetching user count:', error);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    
    fetchUserCount();
  }, []);
  
  // Calculate product statistics
  const totalProducts = products.length;
  const featuredProducts = products.filter(p => p.featured).length;
  const newProducts = products.filter(p => p.new).length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const recentOrders = orders.length;
  
  // Loading states
  const isLoading = productsLoading || ordersLoading || isLoadingUsers || isLoadingOrders;
  
  return (
    <AdminLayout title="Dashboard">
      {/* Dashboard Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-primary/10 mr-3">
              <PackageSearch size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Products</p>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <h4 className="text-2xl font-semibold">{totalProducts}</h4>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-50 mr-3">
              <BarChart3 size={20} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <h4 className="text-2xl font-semibold">${totalRevenue.toFixed(2)}</h4>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-50 mr-3">
              <Users size={20} className="text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
              {isLoadingUsers ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <h4 className="text-2xl font-semibold">{userCount}</h4>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-amber-50 mr-3">
              <ClipboardList size={20} className="text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
              {isLoadingOrders ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <h4 className="text-2xl font-semibold">{recentOrders}</h4>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <h3 className="text-lg font-medium mb-4">Sales by Product Category</h3>
          {isLoading ? (
            <Skeleton className="h-56 w-full" />
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                  <span>Men</span>
                </div>
                <span className="font-medium">{products.filter(p => p.category === 'men').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span>Women</span>
                </div>
                <span className="font-medium">{products.filter(p => p.category === 'women').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Accessories</span>
                </div>
                <span className="font-medium">{products.filter(p => p.category === 'accessories').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span>Featured</span>
                </div>
                <span className="font-medium">{featuredProducts}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span>New Arrivals</span>
                </div>
                <span className="font-medium">{newProducts}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <h3 className="text-lg font-medium mb-4">Orders by Status</h3>
          {isLoading ? (
            <Skeleton className="h-56 w-full" />
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span>Processing</span>
                </div>
                <span className="font-medium">{orders.filter(o => o.status === 'processing').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span>Shipped</span>
                </div>
                <span className="font-medium">{orders.filter(o => o.status === 'shipped').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Delivered</span>
                </div>
                <span className="font-medium">{orders.filter(o => o.status === 'delivered').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span>Cancelled</span>
                </div>
                <span className="font-medium">{orders.filter(o => o.status === 'cancelled').length}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Admin Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center p-6 border rounded-lg hover:border-primary transition-colors bg-white shadow-sm">
          <PackageSearch size={48} className="mb-4 text-primary" />
          <h3 className="text-xl font-medium mb-2">Manage Products</h3>
          <p className="text-muted-foreground text-center mb-4">
            Add, edit, or remove products from your store
          </p>
          <Button 
            onClick={() => navigate('/admin/products')}
            className="mt-auto"
          >
            Manage Products
          </Button>
        </div>
        
        <div className="flex flex-col items-center p-6 border rounded-lg hover:border-primary transition-colors bg-white shadow-sm">
          <ClipboardList size={48} className="mb-4 text-primary" />
          <h3 className="text-xl font-medium mb-2">Manage Orders</h3>
          <p className="text-muted-foreground text-center mb-4">
            View and manage customer orders
          </p>
          <Button 
            onClick={() => navigate('/admin/orders')}
            className="mt-auto"
          >
            Manage Orders
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
