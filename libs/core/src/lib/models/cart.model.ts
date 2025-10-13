import { CartItem } from "./cart-item.model";

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  discount: number;
  couponCode?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
