
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageSearch, ClipboardList, BarChart3, Users } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { products } from '@/data/products';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  
  // Calculate some basic statistics for the dashboard
  const totalProducts = products.length;
  const featuredProducts = products.filter(p => p.featured).length;
  const newProducts = products.filter(p => p.new).length;
  
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
              <h4 className="text-2xl font-semibold">{totalProducts}</h4>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-50 mr-3">
              <BarChart3 size={20} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Featured Products</p>
              <h4 className="text-2xl font-semibold">{featuredProducts}</h4>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-50 mr-3">
              <Users size={20} className="text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">New Products</p>
              <h4 className="text-2xl font-semibold">{newProducts}</h4>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-amber-50 mr-3">
              <ClipboardList size={20} className="text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Recent Orders</p>
              <h4 className="text-2xl font-semibold">4</h4>
            </div>
          </div>
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
          <h3 className="text-xl font-medium mb-2">View Orders</h3>
          <p className="text-muted-foreground text-center mb-4">
            View and manage customer orders
          </p>
          <Button 
            onClick={() => navigate('/admin/orders')}
            className="mt-auto"
          >
            View Orders
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
