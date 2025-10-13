export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  name: string;
  quantity: number;
  price: number; // Price at time of purchase
  discount: number;
  total: number;
  sku: string;
  createdAt?: Date;
  updatedAt?: Date;
}
