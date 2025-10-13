export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  couponCode?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  shippingAddress: string;
  billingAddress: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
