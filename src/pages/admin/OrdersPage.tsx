
import React, { useState, useEffect } from 'react';
import { Eye, XCircle, CheckCircle2, Clock, Loader2, Truck } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose,
  DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useOrders } from '@/context/OrderContext';
import { Order, OrderStatus } from '@/types';

const OrdersPage = () => {
  const { getAllOrders, updateOrderStatus, isLoading } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const allOrders = await getAllOrders();
        setOrders(allOrders);
      } catch (error) {
        console.error('Failed to load orders:', error);
        toast.error('Failed to load orders');
      }
    };
    
    loadOrders();
  }, [getAllOrders]);
  
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };
  
  const getStatusBadge = (status: OrderStatus) => {
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
            <CheckCircle2 size={12} />
            Delivered
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-red-50 text-red-700 border-red-200">
            <XCircle size={12} />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };
  
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      setIsUpdatingStatus(true);
      await updateOrderStatus(orderId, status);
      
      // Update the local orders state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status } : order
        )
      );
      
      // Update the selected order if it's open
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          status
        });
      }
      
      toast.success(`Order status updated to ${status}`);
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
  if (isLoading) {
    return (
      <AdminLayout title="Orders">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading orders...</span>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title="Orders">
      <div className="mb-6">
        <p className="text-muted-foreground">
          View and manage customer orders
        </p>
      </div>
      
      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">Order ID</th>
              <th className="py-2 px-4 text-left">Customer</th>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Total</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map(order => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{order.id.slice(0, 8)}</td>
                  <td className="py-2 px-4">{order.customerName}</td>
                  <td className="py-2 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-2 px-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="py-2 px-4">${order.total.toFixed(2)}</td>
                  <td className="py-2 px-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewDetails(order)}
                    >
                      <Eye size={16} className="mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id.slice(0, 8)}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Customer Information</h3>
                  <p className="mt-1">{selectedOrder.customerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.email}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Shipping Address</h3>
                  <p className="mt-1 text-sm">
                    {selectedOrder.shippingAddress.streetAddress}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}, {selectedOrder.shippingAddress.postalCode}, {selectedOrder.shippingAddress.country}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Order Status</h3>
                  <div className="mt-1">
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Items</h3>
                  <ul className="mt-2 divide-y border rounded-md overflow-hidden">
                    {selectedOrder.items.map((item, index) => (
                      <li key={index} className="p-2 flex justify-between">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} {item.size && `- Size: ${item.size}`}
                          </p>
                        </div>
                        <p>${item.price.toFixed(2)}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex justify-between font-medium pt-2 border-t">
                  <p>Total</p>
                  <p>${selectedOrder.total.toFixed(2)}</p>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Update Status</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm"
                      variant={selectedOrder.status === 'processing' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'processing')}
                      disabled={isUpdatingStatus}
                    >
                      <Clock size={16} className="mr-1" />
                      Processing
                    </Button>
                    <Button 
                      size="sm"
                      variant={selectedOrder.status === 'shipped' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'shipped')}
                      disabled={isUpdatingStatus}
                    >
                      <Truck size={16} className="mr-1" />
                      Shipped
                    </Button>
                    <Button 
                      size="sm"
                      variant={selectedOrder.status === 'delivered' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'delivered')}
                      disabled={isUpdatingStatus}
                    >
                      <CheckCircle2 size={16} className="mr-1" />
                      Delivered
                    </Button>
                    <Button 
                      size="sm"
                      variant={selectedOrder.status === 'cancelled' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'cancelled')}
                      disabled={isUpdatingStatus}
                    >
                      <XCircle size={16} className="mr-1" />
                      Cancel
                    </Button>
                  </div>
                  {isUpdatingStatus && (
                    <div className="mt-2 flex items-center justify-center">
                      <Loader2 size={16} className="animate-spin mr-2" />
                      <span className="text-sm">Updating status...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default OrdersPage;
