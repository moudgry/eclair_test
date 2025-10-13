import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonBackButton, IonBadge, IonButtons, IonContent, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonNote, IonRefresher, IonRefresherContent, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Order } from '@eclair_commerce/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.css'],
  standalone: true,
  imports: [IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonNote, IonButtons, IonLabel, IonBackButton, IonRefresher, IonRefresherContent, IonItemSliding, IonItemOption, IonItemOptions, IonBadge, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class OrdersPage {
  orders: Order[] = [];
  isLoading = false;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private tokenService: TokenService
  ) {}

  ionViewDidEnter() {
    this.loadOrders();
  }

  async loadOrders(event?: any) {
    this.isLoading = true;
    try {
      const token = await this.tokenService.getToken();
      if (token) {
        this.orders = await firstValueFrom(this.orderService.getUserOrders());
        //this.orders = await this.orderService.getUserOrders();
      }
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Failed to load orders',
        duration: 3000,
        position: 'top',
        color: 'danger'
      });
      toast.present();
    } finally {
      this.isLoading = false;
      if (event) event.target.complete();
    }
  }

  formatDate(dateString: string | Date): string {
    return new Date(dateString).toLocaleDateString();
  }

  getStatusColor(status: string): string {
    return status == 'delivered' ? 'success' : 'warning';
  }

  async cancelOrder(orderId: string) {
    try {
      await this.orderService.cancelOrder(orderId);
      this.loadOrders();
    } catch (error) {
      // Handle error
    }
  }

  async loadMoreOrders(event: any) {
    // Implement pagination if needed
    event.target.complete();
  }

  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }
}
