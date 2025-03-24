
export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  featured?: boolean;
  new?: boolean;
  sizes: string[];
  colors?: string[];
};

export type Category = {
  id: string;
  name: string;
  description?: string;
};

export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  userId: string;
  items: {
    productId: string;
    quantity: number;
    size: string;
    price: number;
  }[];
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  createdAt: Date;
};

export type Address = {
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
};

export type PaymentMethod = {
  id: string;
  type: 'card' | 'paypal';
  details: any;
};
