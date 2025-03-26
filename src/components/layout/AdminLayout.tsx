
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if admin is logged in
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      toast.error('Please log in as admin to access this page');
      navigate('/admin/login');
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    toast.success('Successfully logged out from admin');
    navigate('/admin/login');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-primary text-primary-foreground shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <ShieldAlert size={24} />
              <h1 className="text-xl font-semibold">Admin Panel</h1>
            </div>
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
      </header>
      
      {/* Admin Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-medium mb-6 pb-2 border-b">{title}</h2>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
