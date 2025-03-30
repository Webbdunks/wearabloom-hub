
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowRight, Clock, Check, Truck } from 'lucide-react';
import { useOrders } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const OrderList = () => {
  const { user } = useAuth();
  const { getUserOrders } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const userOrders = await getUserOrders(user.id);
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [user, getUserOrders]);
  
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
            <Truck size={12} />
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
      case 'cancelled':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-red-50 text-red-700 border-red-200">
            <Check size={12} />
            Cancelled
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
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }
  
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Orders Yet</h3>
        <p className="text-muted-foreground mb-6">
          You haven't placed any orders yet.
        </p>
        <Button onClick={() => navigate('/products')}>
          Start Shopping <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="border rounded-lg p-6">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">Order #{order.id.slice(0, 8)}</h3>
                {getStatusBadge(order.status)}
              </div>
              <p className="text-sm text-muted-foreground">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <p className="font-medium">${order.total.toFixed(2)}</p>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <div className="flex flex-wrap gap-4">
              {order.items.slice(0, 2).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <p className="text-sm">
                    {item.quantity} × {item.productName} 
                    <span className="text-muted-foreground ml-1">({item.size})</span>
                  </p>
                </div>
              ))}
              {order.items.length > 2 && (
                <p className="text-sm text-muted-foreground">
                  +{order.items.length - 2} more items
                </p>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              <span className="inline-block mr-4">
                <Truck size={14} className="inline mr-1" /> 
                Shipping to: {order.shippingAddress.city}, {order.shippingAddress.state}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/order-confirmation', { state: { orderId: order.id } })}
            >
              View Details
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
