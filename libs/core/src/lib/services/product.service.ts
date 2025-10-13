import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models';

@Injectable()
export abstract class ProductService {
  abstract getProducts(
    page: number,
    pageSize: number,
    filters?: any
  ): Observable<Product[]>;

  abstract getProduct(id: string): Observable<Product>;

  abstract searchProducts(query: string): Observable<Product[]>;

  abstract getFeaturedProducts(): Observable<Product[]>;

  abstract getNewArrivals(): Observable<Product[]>;
}
