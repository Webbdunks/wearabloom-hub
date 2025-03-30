
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Package, ArrowRight, CreditCard, Check, Clock } from 'lucide-react';
import { useOrders } from '@/context/OrderContext';
import { Order } from '@/types';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getAllOrders, getUserOrders } = useOrders();
  
  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }
    
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        
        // First try to get all orders and find the one with matching ID
        const orders = await getAllOrders();
        const foundOrder = orders.find(o => o.id === orderId);
        
        if (foundOrder) {
          setOrder(foundOrder);
        }
        
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId, navigate, getAllOrders, getUserOrders]);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock size={12} />
            Processing
          </Badge>
        );
      case 'shipped':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
            <Package size={12} />
            Shipped
          </Badge>
        );
      case 'delivered':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
            <Check size={12} />
            Delivered
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-3xl mx-auto px-4 py-12">
          <div className="bg-card border rounded-lg p-8">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Package className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="text-center mb-8">
              <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
              <Skeleton className="h-4 w-2/4 mx-auto" />
            </div>
            <div className="border rounded-lg p-6 mb-8">
              <Skeleton className="h-6 w-1/4 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!order) {
    return (
      <Layout>
        <div className="container max-w-3xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-light mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find the order you're looking for.
          </p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <div className="bg-card border rounded-lg p-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Package className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light mb-2">Thank You for Your Order!</h1>
            <p className="text-muted-foreground">
              Your order has been confirmed and will be shipped soon.
            </p>
          </div>
          
          <div className="border rounded-lg p-6 mb-8">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <div>
                <h2 className="text-lg font-medium">Order #{order.id.slice(0, 8)}</h2>
                <p className="text-sm text-muted-foreground">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>{getStatusBadge(order.status)}</div>
            </div>
            
            <Separator className="mb-6" />
            
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Items in your order</h3>
            
            <div className="space-y-4 mb-6">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      Size: {item.size} · Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">${item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <Separator className="mb-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Shipping Address</h3>
                <p className="text-sm">{order.shippingAddress.fullName}</p>
                <p className="text-sm">{order.shippingAddress.streetAddress}</p>
                <p className="text-sm">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p className="text-sm">{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && <p className="text-sm">{order.shippingAddress.phone}</p>}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Payment Information</h3>
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard size={16} />
                  <span>Payment Method: Credit Card</span>
                </div>
                <p className="text-sm mt-2">Billing address same as shipping address</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg bg-secondary/10 p-6">
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>
            
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>${(order.total * 0.92).toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Tax (8%)</p>
                <p>${(order.total * 0.08).toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping</p>
                <p>Free</p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between font-medium">
              <p>Total</p>
              <p>${order.total.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button asChild variant="outline">
              <Link to="/account">
                View Your Orders
              </Link>
            </Button>
            
            <Button asChild>
              <Link to="/products">
                Continue Shopping <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
          
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmationPage;
