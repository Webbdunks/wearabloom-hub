
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const CartPage = () => {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleProceedToCheckout = () => {
    if (user) {
      navigate('/checkout');
    } else {
      navigate('/login', { state: { redirect: '/checkout' } });
    }
  };
  
  // Calculate shipping cost (free over $100)
  const shippingCost = subtotal >= 100 ? 0 : 10;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shippingCost + tax;

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 pt-8 pb-16">
        <h1 className="text-3xl font-light mb-2">Your Cart</h1>
        <p className="text-muted-foreground mb-8">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </p>
        
        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart items */}
            <div className="lg:col-span-2">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex border-b border-border py-6">
                  {/* Product image */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-secondary/10 mr-4 sm:mr-6 shrink-0">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Product details */}
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Size: {item.size}
                        </p>
                      </div>
                      <p className="font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      {/* Quantity controls */}
                      <div className="flex items-center">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="w-10 text-center">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                      
                      {/* Remove button */}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.product.id, item.size)}
                      >
                        <Trash2 size={16} className="mr-1" /> Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between mt-6">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
                <Button asChild variant="outline">
                  <Link to="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>
            
            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-secondary/10 p-6">
                <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>${subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Shipping</p>
                    <p>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Tax (8%)</p>
                    <p>${tax.toFixed(2)}</p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between font-medium mb-6">
                  <p>Total</p>
                  <p>${total.toFixed(2)}</p>
                </div>
                
                <Button 
                  className="w-full flex items-center justify-center gap-2" 
                  onClick={handleProceedToCheckout}
                >
                  <ShoppingBag size={16} /> Proceed to Checkout
                </Button>
                
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Shipping & taxes calculated at checkout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <ShoppingBag size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button asChild>
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
