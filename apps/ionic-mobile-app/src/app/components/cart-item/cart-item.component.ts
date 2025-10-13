import { CurrencyPipe } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CartItem } from '@eclair_commerce/core';
import {
  IonButton,
  IonItem,
  IonIcon,
  IonButtons,
  IonImg,
  IonLabel,
  IonThumbnail,
  IonInput
} from "@ionic/angular/standalone";

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css'],
  standalone: true,
    imports: [
    IonItem,
    IonLabel,
    IonImg,
    IonButton,
    IonButtons,
    IonThumbnail,
    IonIcon,
    IonInput,
    CurrencyPipe
  ]
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() remove = new EventEmitter<string>();
  @Output() quantityChange = new EventEmitter<{id: string, quantity: number}>();

  updateQuantity(newQuantity: string | number | null | undefined) {
    if (newQuantity === null || newQuantity === undefined) {
      return;
    }

    const quantity = typeof newQuantity === 'string'
      ? parseInt(newQuantity, 10)
      : newQuantity;

    const MAX_QUANTITY = 100;
    if (!isNaN(quantity) && quantity > 0 && quantity <= MAX_QUANTITY) {
      this.quantityChange.emit({
        id: this.item.product.id,
        quantity
      });
    } else if (quantity > MAX_QUANTITY) {
      this.quantityChange.emit({
        id: this.item.product.id,
        quantity: MAX_QUANTITY
      });
    }
  }
}
