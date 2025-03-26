
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageSearch, ClipboardList } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  
  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col items-center p-6 border rounded-lg hover:border-primary transition-colors">
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
        
        <div className="flex flex-col items-center p-6 border rounded-lg hover:border-primary transition-colors">
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
