import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
  price: number; // Price at time of addition
  createdAt?: Date;
  updatedAt?: Date;
}
