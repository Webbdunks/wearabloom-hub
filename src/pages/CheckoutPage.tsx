
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Check } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Address } from '@/types';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState<Address>({
    fullName: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardInfo, setCardInfo] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  
  // Calculate costs
  const shippingCost = subtotal >= 100 ? 0 : 10;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shippingCost + tax;
  
  // Check if user is logged in, redirect to login if not
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { redirect: '/checkout' } });
    }
  }, [user, navigate]);
  
  // Check if cart is empty, redirect to cart if empty
  useEffect(() => {
    if (items.length === 0 && !isOrderPlaced) {
      navigate('/cart');
    }
  }, [items, navigate, isOrderPlaced]);
  
  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };
  
  const handleCardInfoChange = (field: string, value: string) => {
    setCardInfo(prev => ({ ...prev, [field]: value }));
  };
  
  const isAddressValid = () => {
    return (
      address.fullName &&
      address.streetAddress &&
      address.city &&
      address.state &&
      address.postalCode &&
      address.country
    );
  };
  
  const isPaymentValid = () => {
    if (paymentMethod === 'credit-card') {
      return (
        cardInfo.number &&
        cardInfo.name &&
        cardInfo.expiry &&
        cardInfo.cvv
      );
    }
    return true; // Other payment methods may not require validation
  };
  
  const handleContinue = () => {
    if (currentStep === 1 && isAddressValid()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && isPaymentValid()) {
      placeOrder();
    }
  };
  
  const placeOrder = () => {
    // Simulating order placement with a timeout
    setTimeout(() => {
      clearCart();
      setIsOrderPlaced(true);
      
      // Simulating redirect to order confirmation after a delay
      setTimeout(() => {
        navigate('/order-confirmation', { state: { orderId: Math.floor(Math.random() * 10000000) } });
      }, 2000);
    }, 1500);
  };
  
  if (isOrderPlaced) {
    return (
      <Layout>
        <div className="container max-w-lg mx-auto px-4 py-20 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-light mb-4">Order Placed!</h1>
          <p className="text-muted-foreground mb-6">
            Your order has been successfully placed. Thank you for your purchase!
          </p>
          <p className="text-muted-foreground mb-8">
            Processing your order...
          </p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-light mb-8 text-center">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Checkout steps */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${currentStep === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  1
                </div>
                <div className="h-px flex-1 bg-border mx-2"></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${currentStep === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  2
                </div>
              </div>
              <div className="flex justify-between px-1">
                <span className="text-sm font-medium">Shipping</span>
                <span className="text-sm font-medium">Payment</span>
              </div>
            </div>
            
            {/* Step 1: Shipping */}
            {currentStep === 1 && (
              <div className="bg-card p-6 border rounded-lg animate-fade-in">
                <h2 className="text-lg font-medium mb-6">Shipping Address</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={address.fullName}
                      onChange={(e) => handleAddressChange('fullName', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="streetAddress">Street Address</Label>
                    <Input
                      id="streetAddress"
                      value={address.streetAddress}
                      onChange={(e) => handleAddressChange('streetAddress', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="state">State / Province</Label>
                    <Input
                      id="state"
                      value={address.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={address.postalCode}
                      onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select 
                      value={address.country}
                      onValueChange={(value) => handleAddressChange('country', value)}
                    >
                      <SelectTrigger id="country" className="mt-1">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="phone">Phone Number (optional)</Label>
                    <Input
                      id="phone"
                      value={address.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <h2 className="text-lg font-medium mb-4">Shipping Method</h2>
                
                <RadioGroup defaultValue="standard" className="mb-6">
                  <div className="flex items-start space-x-3 border p-4 rounded-md mb-3">
                    <RadioGroupItem value="standard" id="standard" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="standard" className="font-medium">Standard Shipping</Label>
                        <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Delivery in 3-5 business days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 border p-4 rounded-md">
                    <RadioGroupItem value="express" id="express" disabled />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="express" className="font-medium text-muted-foreground">Express Shipping</Label>
                        <span className="text-muted-foreground">$15.00</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Delivery in 1-2 business days (Not available for your location)
                      </p>
                    </div>
                  </div>
                </RadioGroup>
                
                <Button 
                  className="w-full"
                  onClick={handleContinue}
                  disabled={!isAddressValid()}
                >
                  Continue to Payment
                </Button>
              </div>
            )}
            
            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <div className="bg-card p-6 border rounded-lg animate-fade-in">
                <h2 className="text-lg font-medium mb-6">Payment Method</h2>
                
                <Tabs defaultValue="card" className="mb-6" onValueChange={setPaymentMethod}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="credit-card" className="flex items-center gap-2">
                      <CreditCard size={16} /> Credit Card
                    </TabsTrigger>
                    <TabsTrigger value="paypal" className="flex items-center gap-2">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.5 8.25H4.5V17.25H19.5V8.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4.5.75H19.5V8.25H4.5V.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4.5 8.25L9.75 4.5L19.5 8.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      PayPal
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="credit-card" className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardInfo.number}
                          onChange={(e) => handleCardInfoChange('number', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          value={cardInfo.name}
                          onChange={(e) => handleCardInfoChange('name', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cardExpiry">Expiry Date</Label>
                          <Input
                            id="cardExpiry"
                            placeholder="MM / YY"
                            value={cardInfo.expiry}
                            onChange={(e) => handleCardInfoChange('expiry', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="cardCvv">CVV</Label>
                          <Input
                            id="cardCvv"
                            placeholder="123"
                            value={cardInfo.cvv}
                            onChange={(e) => handleCardInfoChange('cvv', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="paypal" className="mt-4">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        You will be redirected to PayPal to complete your purchase.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setCurrentStep(1)}
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={handleContinue}
                    disabled={!isPaymentValid()}
                  >
                    <Truck size={16} /> Place Order
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-secondary/10 p-6 rounded-lg border">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.size}`} className="flex gap-3">
                    <div className="w-16 h-16 bg-background shrink-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Size: {item.size} / Qty: {item.quantity}
                      </p>
                      <p className="text-sm mt-1">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3 text-sm">
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
              
              <div className="flex justify-between font-medium">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
