
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, LogOut, Package, ClipboardList, LayoutDashboard, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('');
  const { user, isAdmin, logout } = useAuth();
  
  useEffect(() => {
    // Check if user is logged in and is admin
    if (!user) {
      toast.error('Please log in to access the admin area');
      navigate('/login');
      return;
    }
    
    // Check if user is admin
    if (!isAdmin) {
      toast.error('You do not have admin privileges');
      navigate('/');
      return;
    }
    
    // Set active menu based on current path
    const path = window.location.pathname;
    if (path.includes('/admin/products')) {
      setActiveMenu('products');
    } else if (path.includes('/admin/orders')) {
      setActiveMenu('orders');
    } else if (path.includes('/admin/dashboard')) {
      setActiveMenu('dashboard');
    }
  }, [navigate, user, isAdmin]);
  
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Admin Header */}
      <header className="bg-primary text-primary-foreground shadow sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <ShieldAlert size={24} />
              <h1 className="text-xl font-semibold">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost" 
                size="sm"
                className="text-primary-foreground hover:text-primary-foreground/90"
                onClick={() => navigate('/')}
              >
                <Home size={16} className="mr-1" />
                View Site
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block w-64 p-4 bg-white border-r min-h-[calc(100vh-64px)]">
          <nav className="space-y-2">
            <Link to="/admin/dashboard">
              <Button 
                variant={activeMenu === 'dashboard' ? 'default' : 'ghost'} 
                className="w-full justify-start"
              >
                <LayoutDashboard size={18} className="mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link to="/admin/products">
              <Button 
                variant={activeMenu === 'products' ? 'default' : 'ghost'} 
                className="w-full justify-start"
              >
                <Package size={18} className="mr-2" />
                Products
              </Button>
            </Link>
            <Link to="/admin/orders">
              <Button 
                variant={activeMenu === 'orders' ? 'default' : 'ghost'} 
                className="w-full justify-start"
              >
                <ClipboardList size={18} className="mr-2" />
                Orders
              </Button>
            </Link>
          </nav>
        </div>
        
        {/* Admin Content */}
        <main className="flex-1 p-4 md:p-8">
          <div className="bg-white shadow rounded-lg p-6 max-w-7xl mx-auto">
            <h2 className="text-2xl font-medium mb-6 pb-2 border-b">{title}</h2>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
