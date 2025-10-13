import { Injectable } from '@angular/core';
import { OrderService as CoreOrderService } from '@eclair_commerce/core';
import { Order } from '@eclair_commerce/core';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { Observable, defer, from, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends CoreOrderService {

  constructor(
    private api: ApiService,
    private authService: AuthService
    ) {
    super();
  }

  createOrder(orderData: any): Observable<Order> {
    return this.api.post<Order>('orders', orderData);
  }

  getUserOrders(): Observable<Order[]> {
    return this.api.get<Order[]>('orders');
  }

  getOrderDetails(orderId: string): Observable<Order> {
    return this.api.get<Order>(`orders/${orderId}`);
  }

  async cancelOrder(orderId: string): Promise<void> {
    await this.api.delete(`orders/${orderId}`);
  }
}
