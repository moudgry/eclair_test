import { Component, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonImg, IonIcon, IonGrid, IonRow, IonCard, IonCol, IonCardHeader, IonCardTitle, IonListHeader, IonLabel } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Category, Product } from '@eclair_commerce/core';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import Swiper from 'swiper';
import { SwiperOptions } from 'swiper/types';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-test2',
  templateUrl: './test2.page.html',
  styleUrls: ['./test2.page.css'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonImg, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonListHeader, IonLabel, CommonModule, FormsModule, ProductCardComponent ]
})
export class Test2Page {
  @ViewChild('swiper') swiper?: ElementRef<{ swiper: Swiper }>;
  featuredProducts: Product[] = [];
  newArrivals: Product[] = [];
  categories: Category[] = [];
  //categories = [
  //  { id: 'electronics', name: 'Electronics', image: 'assets/electronics.jpg' },
  //  { id: 'clothing', name: 'Clothing', image: 'assets/clothing.jpg' },
  //];
  swiperConfig: SwiperOptions = {
    slidesPerView: 1.2,
    spaceBetween: 10,
    centeredSlides: true,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    breakpoints: {
      640: { slidesPerView: 2.5 },
      768: { slidesPerView: 3.5 },
      1024: { slidesPerView: 4.5 }
    }
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private router: Router
  ) {}

  ionViewDidEnter() {
    this.loadCategories();
    //this.loadFeaturedProducts();
    this.loadNewArrivals();
  }

  async loadCategories() {
    this.categories = await firstValueFrom(this.categoryService.getAllCategories());
  }

  //loadFeaturedProducts() {
  //  this.productService.getFeaturedProducts().subscribe(products => {
  //    this.featuredProducts = products;
  //  });
  //}

  loadNewArrivals() {
    this.productService.getNewArrivals().subscribe(products => {
      this.newArrivals = products;
    });
  }

  navigateToCategory(category: string) {
    this.router.navigate(['/products'], {
      queryParams: { category }
    });
  }

  trackByCategoryId(index: number, category: Category): string {
    return category.id;
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }
}
