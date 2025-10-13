import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '@eclair_commerce/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ToastController } from '@ionic/angular';
import { TruncatePipe } from "../../pipes/truncate.pipe";
import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  IonCard,
  IonImg,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
} from "@ionic/angular/standalone";

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  standalone: true,
  imports: [
    IonCard,
    IonImg,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    CurrencyPipe,
    TruncatePipe,
    CommonModule
  ]
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() showActions = true;
  @Output() clicked = new EventEmitter<string>();

  constructor(
    private cartService: CartService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  async addToCart(event: MouseEvent) {
    await this.cartService.addToCart(this.product);
    const toast = await this.toastCtrl.create({
      message: `${this.product.name} added to cart`,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  viewDetails() {
    //this.clicked.emit(this.product.id);
    this.router.navigate(['/products', this.product.id]);
  }
}
