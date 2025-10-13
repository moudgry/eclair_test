import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonBadge,
  IonSearchbar,
  IonContent,
  IonGrid,
  IonRow,
  IonCol, IonSpinner } from '@ionic/angular/standalone';
import { ProductService } from '../../services/product.service';
import { Product, StateService } from '@eclair_commerce/core';
import { CartService } from '../../services/cart.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { InfiniteScrollCustomEvent, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.css'],
  standalone: true,
  imports: [IonSpinner,
      IonHeader,
      IonToolbar,
      IonTitle,
      IonButtons,
      IonButton,
      IonIcon,
      IonBadge,
      IonSearchbar,
      IonContent,
      IonGrid,
      IonRow,
      IonCol,
      ProductCardComponent,
      AsyncPipe,
      FormsModule,
      CommonModule
    ]
})
export class ProductsPage implements OnInit {
  products: Product[] = [];
  isLoading = false;
  page = 1;
  pageSize = 10;
  searchQuery = '';
  cartCount$: Observable<number>; // Declare without initialization
  private searchSubject = new Subject<string>();

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private stateService: StateService
    ) {
    // Initialize in constructor instead of property declaration
    this.cartCount$ = this.cartService.cart$.pipe(
      map(cart => cart.items.reduce((count, item) =>
        count + (item.quantity || 0), 0)
      )
    );

    // Subscribe to state changes
    this.stateService.select('products').subscribe(products => {
      this.products = products;
    });
  }

  async ngOnInit() {
    await this.loadProducts();

    // Set up debounced search
    this.searchSubject.pipe(
      debounceTime(300), // Wait 300ms after the last event
      distinctUntilChanged() // Only if the value has changed
    ).subscribe(query => {
      this.searchQuery = query;
      this.searchProducts();
    });
  }

  async loadProducts(event?: InfiniteScrollCustomEvent) {
    this.isLoading = true;
    const loading = await this.loadingCtrl.create({
      message: 'Loading products...',
      spinner: 'bubbles'
    });
    await loading.present();

    this.productService.getProducts(this.page, this.pageSize).subscribe({
      next: (products) => {
        // State will be updated via the subscription in constructor

        this.products = [...this.products, ...products];
        this.isLoading = false;
        loading.dismiss();
        event?.target.complete();
        if (products.length < this.pageSize) {
          if (event && event.target) {
            event.target.disabled = true;
          }
          //event?.target.disabled = true;
        }
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        loading.dismiss();
        event?.target.complete();
      }
    });
  }

  loadMore(event: InfiniteScrollCustomEvent) {
    this.page++;
    this.loadProducts(event);
  }

  searchProducts() {
    console.log('Search button clicked with query:', this.searchQuery);

    if (this.searchQuery && this.searchQuery.trim().length > 0) {
      this.isLoading = true;
      this.productService.searchProducts(this.searchQuery).subscribe({
        next: (products) => {
          console.log('Search results received:', products);
          this.products = products;
          this.isLoading = false;

          // If no results, show message
          if (products.length === 0) {
            this.presentToast('No products found matching your search', 'warning');
          }
        },
        error: (error) => {
          console.error('Search failed with error:', error);
          this.products = [];
          this.isLoading = false;
          this.presentToast('Search failed. Please try again.', 'danger');
        }
      });
    } else {
      /*
      // If search query is empty, load all products
      console.log('Empty search query, loading all products');
      this.loadProducts();
      */
      console.log('Empty search query, cancelling search');
      this.cancelSearch();
    }
  }

  // Add this method to handle search cancellation
  cancelSearch() {
    this.isLoading = true;
    this.productService.cancelSearch().subscribe({
      next: (products) => {
        console.log('Search cancelled, all products loaded:', products.length);
        this.products = products;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load products after search cancellation:', error);
        this.products = [];
        this.isLoading = false;
        this.presentToast('Failed to load products', 'danger');
      }
    });
  }

  onSearchInput(event: any) {
    console.log('Search button clicked with query:', this.searchQuery);
    this.searchSubject.next(event.target.value);
  }

  // Also update the clear button in your template if you have one
  clearSearch() {
    this.searchQuery = '';
    this.searchSubject.next('');
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  logOut() {
    //alert('dddddd');
    this.authService.logout();
  }

  async presentToast(message: string, color = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top',
      color
    });
    toast.present();
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }
}
