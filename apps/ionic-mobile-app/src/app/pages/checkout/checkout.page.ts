import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonNote, IonRadio, IonRadioGroup, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Cart, CartItem } from '@eclair_commerce/core';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.css'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonInput, IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonListHeader, IonItem, IonNote, IonButton, IonButtons, IonLabel, IonBackButton, IonRadio, IonRadioGroup, CommonModule, FormsModule, ReactiveFormsModule]
})
export class CheckoutPage {
  checkoutForm: FormGroup;
  cart: Cart | null = null;
  paymentMethods = ['Credit Card', 'PayPal', 'Apple Pay', 'Google Pay'];

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    this.checkoutForm = this.fb.group({
      fullName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      paymentMethod: ['Credit Card', [Validators.required]]
    });

    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  async placeOrder() {
    if (this.checkoutForm.invalid || !this.cart) return;

    try {
      const order = await firstValueFrom(
        this.orderService.createOrder({
          ...this.checkoutForm.value,
          items: this.cart.items,
          total: this.cart.total
        })
      );
      await this.cartService.clearCart();

      this.router.navigate(['/order-confirmation', order.id]);
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Failed to place order. Please try again.',
        duration: 3000,
        position: 'top',
        color: 'danger'
      });
      toast.present();
    }
  }

  trackByCartItemId(index: number, cartItem: CartItem): string {
    return cartItem.product.id;
  }
}
