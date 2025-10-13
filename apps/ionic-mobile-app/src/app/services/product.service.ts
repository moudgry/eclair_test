import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ProductService as CoreProductService, Product, CacheService, StateService } from '@eclair_commerce/core';
import { Observable, defer, from, map, of } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { finalize, shareReplay, tap, catchError } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends CoreProductService {
  private isFetching = false;
  private productsCache$?: Observable<Product[]> | null = null;

  constructor(
    private api: ApiService,
    private cacheService: CacheService,
    private stateService: StateService
    ) {
    super();
  }

  getProducts(page: number, pageSize: number, refresh = false): Observable<Product[]> {
    // Check state first
    const stateProducts = this.stateService.select('products');

    const cacheKey = `products_${page}_${pageSize}`;

    // If we have products in state and not forcing refresh, use them
    // Check cache first if not forcing refresh
    if (!refresh) {
      const cached = this.cacheService.get<Product[]>(cacheKey);
      if (cached) return of(cached);
    }

    return this.fetchProductsFromApi(page, pageSize, cacheKey).pipe(
      tap(products => {
        this.cacheService.set(cacheKey, products);
        this.stateService.setProducts(products); // Update state
      }),
      catchError(error => {
        console.error('Failed to fetch products:', error);
        return of([]);
      })
    );

  }

  private fetchProductsFromApi(page: number, pageSize: number, cacheKey: string): Observable<Product[]> {
    // Return existing observable if already fetching
    if (this.isFetching && this.productsCache$) {
      return this.productsCache$;
    }

    this.isFetching = true;
    /*this.productsCache$ = this.api.get<Product[]>('products').pipe(
      finalize(() => {
        this.isFetching = false;
        this.productsCache$ = null;
      }),
      shareReplay(1) // Share the result with multiple subscribers
    );*/
    this.productsCache$ = this.api.get<Product[]>(`products?page=${page}&limit=${pageSize}`).pipe(
      tap(products => this.cacheService.set(cacheKey, products)),
      finalize(() => {
        this.isFetching = false;
        this.productsCache$ = null;
      }),
      shareReplay(1), // Share the result with multiple subscribers
      catchError(error => {
        console.error('Failed to fetch products:', error);
        return of([]);
      })
    );

    return this.productsCache$;
  }

  getProduct(id: string): Observable<Product> {
    // Check state first
    const stateProducts = this.stateService.select('products');
    // Implementation would check if product exists in state

    const cacheKey = `product_${id}`;
    // Check cache first
    const cached = this.cacheService.get<Product>(cacheKey);
    if (cached) {
      return of(cached);
    }

    // Fetch from API and cache
    return this.api.get<Product>(`products/${id}`).pipe(
      tap(product => this.cacheService.set(cacheKey, product))
    );
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.api.post<Product>('products', product).pipe(
      tap(newProduct => {
        this.clearProductCache();
        this.stateService.addProduct(newProduct); // Update state
      })
    );
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.api.put<Product>(`products/${id}`, product).pipe(
      tap(updatedProduct => {
        this.clearProductCache();
        this.stateService.updateProduct(updatedProduct); // Update state
      })
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.api.delete<void>(`products/${id}`).pipe(
      tap(() => {
        this.clearProductCache();
        this.stateService.removeProduct(id); // Update state
      })
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    console.log('Frontend search query:', query);

      if (!query || query.trim().length === 0) {
      console.log('Empty query, clearing search cache and loading all products');
      // Clear search cache and load all products directly
      this.clearSearchCache();
      return this.getProducts(1, 10, true); // // Return all products if query is empty and Force refresh
    }

    const cacheKey = `products_search_${query}`;
    // Check cache first
    const cached = this.cacheService.get<Product[]>(cacheKey);
    if (cached) {
      console.log('Returning cached results:', cached.length);
      return of(cached);
    }

    // Fetch from API and cache
    return this.api.get<Product[]>(`products/search?q=${encodeURIComponent(query)}`).pipe(
      tap(products => {
        console.log('API search results:', products);
        if(products && products.length > 0) {
          this.cacheService.set(cacheKey, products, 300000); // 5 minute cache for searches
        }
      }),
      catchError(error => {
        console.error('Search API error:', error);
        //throw error; // Rethrow for component handling
        return of([]); // Return empty array instead of throwing
      })
    );
  }

  // Add a method to handle search cancellation
  cancelSearch(): Observable<Product[]> {
    console.log('Cancelling search, loading all products');
    this.clearSearchCache();
    return this.getProducts(1, 10, true); // Force refresh
  }

  getFeaturedProducts(): Observable<Product[]> {
    const cacheKey = 'featured_products';

    // Check cache first
    const cached = this.cacheService.get<Product[]>(cacheKey);
    if (cached) {
      return of(cached);
    }

    // Fetch from API and cache
    return this.api.get<Product[]>('products/featured').pipe(
      tap(products => this.cacheService.set(cacheKey, products, 3600000)), // 1 hour cache for featured
      catchError(error => {
        console.error('Failed to get featured products:', error);
        // Fallback to all products if featured endpoint fails
        return this.getProducts(1, 10).pipe(
          map(products => products.slice(0, 4))
        );
      })
    );
  }

  getNewArrivals(): Observable<Product[]> {
    const cacheKey = 'new_arrivals';

    // Check cache first
    const cached = this.cacheService.get<Product[]>(cacheKey);
    if (cached) {
      return of(cached);
    }

    // Fetch from API and cache
    return this.api.get<Product[]>('products/new').pipe(
      tap(products => this.cacheService.set(cacheKey, products, 1800000)), // 30 minute cache for new arrivals
      catchError(error => {
        console.error('Failed to get new arrivals:', error);
        // Fallback to all products if new arrivals endpoint fails
        return this.getProducts(1, 10).pipe(
          map(products => products.slice(0, 4))
        );
      })
    );
  }

  // Clear specific cache entries
  clearProductCache(): void {
    //this.cacheService.remove(this.CACHE_KEY);
    this.clearCache('products_');
    this.clearSearchCache();

    /*const keys = this.cacheService.keys();
    keys.filter(key => key.startsWith('product_'))
        .forEach(key => this.cacheService.remove(key));*/
    this.clearCache('product_');
  }

  clearSearchCache(): void {
    // You might want to implement pattern-based cache clearing
    const keys = this.cacheService.keys();
    keys.filter(key => key.startsWith('products_search_'))
        .forEach(key => this.cacheService.remove(key));
  }

  clearCache(pattern?: string): void {
    if (pattern) {
      const keys = this.cacheService.keys();
      keys.filter(key => key.includes(pattern))
          .forEach(key => this.cacheService.remove(key));
    } else {
      this.cacheService.clear();
    }
  }

  calculateDiscount(product: Product): number {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  }

  // Update the enhanceProductWithDiscount method
  enhanceProductWithDiscount(product: Product): Product {
    // If discount is not provided but originalPrice is, calculate it
    if (product.originalPrice && !product.discount) {
      return {
        ...product,
        discount: this.calculateDiscount(product)
      };
    }

    // If discount is provided but originalPrice is not, calculate originalPrice
    if (product.discount && !product.originalPrice) {
      return {
        ...product,
        originalPrice: Math.round(product.price / (1 - product.discount / 100))
      };
    }

    return product;
  }
}
