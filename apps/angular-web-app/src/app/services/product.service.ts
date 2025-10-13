import { Injectable } from '@angular/core';
import { ApiService, EnvironmentService } from '@eclair_commerce/core';
import { Observable } from 'rxjs';
import { Product } from '@eclair_commerce/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends ApiService {
  constructor(
    http: HttpClient,
    private env: EnvironmentService
    ) {
    super(http, env.apiUrl);
  }

  getProducts(): Observable<Product[]> {
    return this.get<Product[]>('products');
  }
}
