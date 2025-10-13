import { Product } from "../models";

export abstract class CartService {

  constructor() {}

  abstract addToCart(product: Product, quantity: number): Promise<void>;

  abstract removeFromCart(productId: string): Promise<void>;

  abstract updateQuantity(productId: string, quantity: number): Promise<void>;

  abstract clearCart(): Promise<void>;
}
