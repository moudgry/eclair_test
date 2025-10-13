import { Observable } from "rxjs";
import { Order } from "../models";

export abstract class OrderService {

  constructor() {}

  abstract createOrder(orderData: any): Observable<Order>;

  abstract getUserOrders(): Observable<Order[]>;

  abstract getOrderDetails(orderId: string): Observable<Order>;

  abstract cancelOrder(orderId: string): Promise<void>;
}
