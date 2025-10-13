import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartService as CoreCartService, Cart, CartItem, Product } from '@eclair_commerce/core';

@Injectable({ providedIn: 'root' })
export class CartService extends CoreCartService {
  private readonly CART_KEY = 'cart';
  private cartSubject = new BehaviorSubject<Cart>({
    userId: '',
    items: [],
    total: 0 ,
    id: '',
    subtotal: 0,
    discount: 0
  });

  cart$ = this.cartSubject.asObservable();

  constructor(private storage: Storage) {
    super();
    this.init();
  }

  private async init() {
    await this.storage.create();
    const cart = await this.storage.get(this.CART_KEY);
    if (cart) {
      this.cartSubject.next(cart);
    }
  }

  async addToCart(product: Product, quantity = 1): Promise<void> {
    const cart = {...this.cartSubject.value}; // Clone cart
    const existingItem = cart.items.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product,
        quantity,
        price: product.price // Use actual product price
      });
    }

    cart.total = this.calculateTotal(cart.items);
    await this.updateCart(cart);
  }

  async removeFromCart(productId: string): Promise<void> {
    const cart = this.cartSubject.value;
    cart.items = cart.items.filter(item => item.product.id !== productId);
    cart.total = this.calculateTotal(cart.items);
    await this.updateCart(cart);
  }

  async updateQuantity(productId: string, quantity: number): Promise<void> {
    const cart = this.cartSubject.value;
    const item = cart.items.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      cart.total = this.calculateTotal(cart.items);
      await this.updateCart(cart);
    }
  }

  async clearCart(): Promise<void> {
    this.cartSubject.next({
      userId: '',
      items: [],
      total: 0,
      id: '',
      subtotal: 0,
      discount: 0
    });
    await this.storage.remove(this.CART_KEY);
  }

  private calculateTotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  private async updateCart(cart: Cart) {
    await this.storage.set(this.CART_KEY, cart);
    this.cartSubject.next({...cart}); // Emit new object
  }
}
