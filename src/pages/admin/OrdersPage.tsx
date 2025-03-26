
import React, { useState } from 'react';
import { Eye, XCircle, CheckCircle2, Clock } from 'lucide-react';
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

type OrderItem = {
  id: string;
  productName: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  customerName: string;
  email: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  items: OrderItem[];
  total: number;
  address: string;
};

// Mock orders data
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'John Doe',
    email: 'john@example.com',
    date: '2023-05-15',
    status: 'completed',
    items: [
      { id: '1', productName: 'Minimal Wool Coat', quantity: 1, price: 289.99 },
      { id: '3', productName: 'Structured Blazer', quantity: 1, price: 199.99 }
    ],
    total: 489.98,
    address: '123 Main St, Mumbai, Maharashtra, 400001, India'
  },
  {
    id: 'ORD-002',
    customerName: 'Jane Smith',
    email: 'jane@example.com',
    date: '2023-05-16',
    status: 'pending',
    items: [
      { id: '6', productName: 'Silk Scarf', quantity: 2, price: 59.99 }
    ],
    total: 119.98,
    address: '456 Park Ave, Delhi, Delhi, 110001, India'
  },
  {
    id: 'ORD-003',
    customerName: 'Mike Johnson',
    email: 'mike@example.com',
    date: '2023-05-14',
    status: 'cancelled',
    items: [
      { id: '4', productName: 'Cashmere Sweater', quantity: 1, price: 149.99 }
    ],
    total: 149.99,
    address: '789 Oak St, Bangalore, Karnataka, 560001, India'
  },
  {
    id: 'ORD-004',
    customerName: 'Sarah Williams',
    email: 'sarah@example.com',
    date: '2023-05-17',
    status: 'pending',
    items: [
      { id: '2', productName: 'Relaxed Linen Shirt', quantity: 1, price: 89.99 },
      { id: '5', productName: 'Slim Fit Jeans', quantity: 1, price: 79.99 },
      { id: '7', productName: 'Leather Tote Bag', quantity: 1, price: 129.99 }
    ],
    total: 299.97,
    address: '321 Pine St, Chennai, Tamil Nadu, 600001, India'
  }
];

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };
  
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock size={12} />
            Pending
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 size={12} />
            Completed
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
  
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
    setIsDetailsOpen(false);
    
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);
    toast.success(`Order status updated to: ${statusText}`);
  };
  
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
            {orders.map(order => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{order.id}</td>
                <td className="py-2 px-4">{order.customerName}</td>
                <td className="py-2 px-4">{order.date}</td>
                <td className="py-2 px-4">
                  {getStatusBadge(order.status)}
                </td>
                <td className="py-2 px-4">र {order.total.toFixed(2)}</td>
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
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
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
                  <p className="mt-1 text-sm">{selectedOrder.address}</p>
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
                    {selectedOrder.items.map(item => (
                      <li key={item.id} className="p-2 flex justify-between">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p>र {item.price.toFixed(2)}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex justify-between font-medium pt-2 border-t">
                  <p>Total</p>
                  <p>र {selectedOrder.total.toFixed(2)}</p>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Update Status</h3>
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      variant={selectedOrder.status === 'pending' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'pending')}
                    >
                      <Clock size={16} className="mr-1" />
                      Pending
                    </Button>
                    <Button 
                      size="sm"
                      variant={selectedOrder.status === 'completed' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                    >
                      <CheckCircle2 size={16} className="mr-1" />
                      Complete
                    </Button>
                    <Button 
                      size="sm"
                      variant={selectedOrder.status === 'cancelled' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                    >
                      <XCircle size={16} className="mr-1" />
                      Cancel
                    </Button>
                  </div>
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
