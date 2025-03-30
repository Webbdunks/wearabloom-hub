
import React, { useState } from 'react';
import { User, Package, LogOut, Home, CreditCard, Settings } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { Separator } from '@/components/ui/separator';
import OrderList from '@/components/account/OrderList';

const AccountPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-light mb-4">You are not logged in</h1>
          <p className="text-muted-foreground mb-6">
            Please log in to view your account.
          </p>
          <Button asChild>
            <a href="/login">Log In</a>
          </Button>
        </div>
      </Layout>
    );
  }

  const formattedDate = user.dateOfBirth 
    ? new Date(user.dateOfBirth).toLocaleDateString() 
    : new Date().toLocaleDateString();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="p-6 bg-card rounded-lg border mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-medium">{user.email}</h2>
                  <p className="text-sm text-muted-foreground">Customer</p>
                </div>
              </div>
              <Separator className="my-4" />
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </div>
            
            <div className="hidden md:block">
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab} 
                orientation="vertical" 
                className="w-full"
              >
                <TabsList className="flex flex-col h-auto gap-1 bg-transparent p-0">
                  <TabsTrigger 
                    value="overview" 
                    className="justify-start px-4 data-[state=active]:bg-secondary/50"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="orders" 
                    className="justify-start px-4 data-[state=active]:bg-secondary/50"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Orders
                  </TabsTrigger>
                  <TabsTrigger 
                    value="addresses" 
                    className="justify-start px-4 data-[state=active]:bg-secondary/50"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Addresses
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings" 
                    className="justify-start px-4 data-[state=active]:bg-secondary/50"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="block md:hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="overview">
                    <Home className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="orders">
                    <Package className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="addresses">
                    <CreditCard className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="settings">
                    <Settings className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="hidden">
              <TabsContent value="overview" className="mt-0">
                <h1 className="text-3xl font-light mb-6">My Account</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-medium">Account Details</h2>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    <p className="text-muted-foreground mb-2">{user.email}</p>
                    <p className="text-muted-foreground">Customer since {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-medium">Recent Orders</h2>
                      <Button variant="outline" size="sm" onClick={() => setActiveTab('orders')}>View All</Button>
                    </div>
                    <OrderList />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="orders" className="mt-0">
                <h1 className="text-3xl font-light mb-6">My Orders</h1>
                <OrderList />
              </TabsContent>
              
              <TabsContent value="addresses" className="mt-0">
                <h1 className="text-3xl font-light mb-6">My Addresses</h1>
                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Saved Addresses</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't saved any addresses yet.
                  </p>
                  <Button>
                    Add New Address
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="mt-0">
                <h1 className="text-3xl font-light mb-6">Account Settings</h1>
                <div className="space-y-6">
                  <div className="border rounded-lg p-6">
                    <h2 className="text-lg font-medium mb-4">Change Password</h2>
                    <p className="text-muted-foreground mb-6">
                      Update your password to keep your account secure.
                    </p>
                    <Button>Change Password</Button>
                  </div>
                  
                  <div className="border rounded-lg p-6">
                    <h2 className="text-lg font-medium mb-4">Delete Account</h2>
                    <p className="text-muted-foreground mb-6">
                      Permanently delete your account and all associated data.
                    </p>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {activeTab === 'overview' && (
              <>
                <h1 className="text-3xl font-light mb-6">My Account</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-medium">Account Details</h2>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    <p className="text-muted-foreground mb-2">{user.email}</p>
                    <p className="text-muted-foreground">Customer since {formattedDate}</p>
                  </div>
                  
                  <div className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-medium">Recent Orders</h2>
                      <Button variant="outline" size="sm" onClick={() => setActiveTab('orders')}>View All</Button>
                    </div>
                    <OrderList />
                  </div>
                </div>
              </>
            )}
            
            {activeTab === 'orders' && (
              <>
                <h1 className="text-3xl font-light mb-6">My Orders</h1>
                <OrderList />
              </>
            )}
            
            {activeTab === 'addresses' && (
              <>
                <h1 className="text-3xl font-light mb-6">My Addresses</h1>
                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Saved Addresses</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't saved any addresses yet.
                  </p>
                  <Button>
                    Add New Address
                  </Button>
                </div>
              </>
            )}
            
            {activeTab === 'settings' && (
              <>
                <h1 className="text-3xl font-light mb-6">Account Settings</h1>
                <div className="space-y-6">
                  <div className="border rounded-lg p-6">
                    <h2 className="text-lg font-medium mb-4">Change Password</h2>
                    <p className="text-muted-foreground mb-6">
                      Update your password to keep your account secure.
                    </p>
                    <Button>Change Password</Button>
                  </div>
                  
                  <div className="border rounded-lg p-6">
                    <h2 className="text-lg font-medium mb-4">Delete Account</h2>
                    <p className="text-muted-foreground mb-6">
                      Permanently delete your account and all associated data.
                    </p>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountPage;
