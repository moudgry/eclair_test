import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, IonList, IonItem, IonLabel, IonNote } from '@ionic/angular/standalone';
import { CartService } from '../../services/cart.service';
import { Observable } from 'rxjs';
import { Cart, CartItem } from '@eclair_commerce/core';
import { CartItemComponent } from '../../components/cart-item/cart-item.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.css'],
  standalone: true,
  imports: [IonBackButton, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonList, IonItem, IonLabel, IonNote, CommonModule, FormsModule, CartItemComponent]
})
export class CartPage implements OnInit {
  cart$: Observable<Cart>;

  constructor(private cartService: CartService) {
    this.cart$ = this.cartService.cart$;
  }

  ngOnInit() {
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(productId: string, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }

  checkout() {
    // Implement checkout logic
  }

  trackByCartItemId(index: number, cartItem: CartItem): string {
    return cartItem.product.id;
  }
}
