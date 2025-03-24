
import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;
  
  // If no orderId was passed, redirect to home
  if (!orderId) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <Layout>
      <div className="container max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-light mb-4">Order Confirmed</h1>
          <p className="text-muted-foreground mb-2">
            Thank you for your purchase!
          </p>
          <p className="text-muted-foreground">
            Your order has been confirmed and will be shipping soon.
          </p>
        </div>
        
        <div className="bg-card p-6 border rounded-lg mb-8">
          <h2 className="text-lg font-medium mb-4">Order Details</h2>
          
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <p className="text-muted-foreground">Order Number</p>
              <p className="font-medium">{orderId}</p>
            </div>
            
            <div className="flex justify-between">
              <p className="text-muted-foreground">Date</p>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
            
            <div className="flex justify-between">
              <p className="text-muted-foreground">Payment Method</p>
              <p>Credit Card</p>
            </div>
            
            <div className="flex justify-between">
              <p className="text-muted-foreground">Shipping Method</p>
              <p>Standard Shipping</p>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <h3 className="text-md font-medium mb-4">Shipping Address</h3>
          <address className="text-sm not-italic">
            <p>Jane Doe</p>
            <p>123 Main Street</p>
            <p>Apt 4B</p>
            <p>New York, NY 10001</p>
            <p>United States</p>
          </address>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-6">
            A confirmation email has been sent to your email address.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to="/orders">
                View Orders
              </Link>
            </Button>
            <Button asChild>
              <Link to="/" className="flex items-center gap-1">
                Continue Shopping <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmationPage;
