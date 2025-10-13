import { Component, ViewChild, ElementRef, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonIcon, IonButton, IonLabel, IonTabBar, IonTabButton, IonBadge, IonSearchbar, IonImg } from '@ionic/angular/standalone';
import { Swiper } from 'swiper';
import { Product, Category } from '@eclair_commerce/core';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { RouterModule } from '@angular/router';
import { ProductHelpersService } from '../../services/product-helpers.service';
import { addIcons } from 'ionicons';
import { arrowForward, cart, home, apps, schoolOutline, star, starHalf, starOutline, menu } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.css'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonBadge, IonTabButton, IonTabBar, IonLabel, IonButton, IonSearchbar, IonIcon, IonContent, IonHeader, IonToolbar, IonImg, CommonModule, FormsModule, RouterModule],
})
export class HomePage implements OnInit {
  @ViewChild('swiper') swiperRef!: ElementRef;
  swiper?: Swiper;

  searchQuery = '';
  banners = [
    {
      image: 'assets/banners/banner1.jpg',
      title: 'Summer Sale',
      description: 'Up to 50% off on selected items',
      cta: 'Shop Now',
      link: '/products'
    },
    {
      image: 'assets/banners/banner2.jpg',
      title: 'New Arrivals',
      description: 'Check out our latest products',
      cta: 'Discover',
      link: '/product-management'
    },
    {
      image: 'assets/banners/banner3.jpg',
      title: 'Free Shipping',
      description: 'On orders over $50',
      cta: 'Learn More',
      link: '/info/shipping'
    }
  ];

  gameProducts: Product[] = [];
  applianceCategories: Category[] = [];
  electronicProducts: Product[] = [];
  schoolCategories: Category[] = [];
  cartItemCount = 0;

  swiperConfig = {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      clickable: true,
    },
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private productHelpers: ProductHelpersService
  ) {}

  ngOnInit() {
    addIcons({ arrowForward, cart, home, apps, schoolOutline, star, starHalf, starOutline, menu });
    this.loadFeaturedData();
    this.loadCartCount();
  }

  ngAfterViewInit() {
    this.swiper = this.swiperRef?.nativeElement?.swiper;
    /*this.banners.forEach((banner, index) => {
      const img = new Image();
      img.onload = () => console.log(`Banner ${index + 1} loaded successfully`);
      img.onerror = () => console.error(`Banner ${index + 1} failed to load: ${banner.image}`);
      img.src = banner.image;
    });*/
  }

  async loadFeaturedData() {
    try {
      // Load game products (featured products)
      this.productService.getFeaturedProducts().subscribe({
        next: (products) => {
          this.gameProducts = this.productHelpers.enhanceProducts(products.slice(0, 4));
        },
        error: (error) => {
          console.error('Error loading featured products:', error);
          // Set empty array to avoid UI issues
          this.gameProducts = [];
        }
      });

      // Load appliance categories (featured categories)
      this.categoryService.getFeaturedCategories().subscribe({
        next: (categories) => {
          console.log('Featured categories loaded:', categories.length);
          this.applianceCategories = categories.slice(0, 4);
        },
        error: (error) => {
          console.error('Error loading featured categories:', error);
          // Set empty array to avoid UI issues
          this.applianceCategories = [];
        }
      });

      // Load electronic products (new arrivals)
      this.productService.getNewArrivals().subscribe({
        next: (products) => {
          this.electronicProducts = this.productHelpers.enhanceProducts(products.slice(0, 4));
        },
        error: (error) => {
          console.error('Error loading new arrivals:', error);
          // Set empty array to avoid UI issues
          this.electronicProducts = [];
        }
      });

      // Load school categories (all categories as fallback)
      this.categoryService.getAllCategories().subscribe({
        next: (categories) => {
          console.log('All categories response:', categories);
          console.log('All categories loaded:', categories.length);

          //
          // Filter out the categories already shown in the featured section
          const featuredCategoryIds = this.applianceCategories.map(cat => cat.id);
          const nonFeaturedCategories = categories.filter(cat => !featuredCategoryIds.includes(cat.id));

          // Use non-featured categories for the school section
          // If there aren't enough, use all categories
          this.schoolCategories = nonFeaturedCategories.length > 0
            ? nonFeaturedCategories.slice(0, 4)
            : categories.slice(0, 4);
          //

          /*
          if (categories.length <= 4) {
            // If we have 4 or fewer categories, use all of them
            this.schoolCategories = [...categories];
          } else {
            // If we have more than 4 categories, use categories 4-8
            this.schoolCategories = categories.slice(4, 8);
          }
          */

          console.log('School categories to display:', this.schoolCategories.length);
        },
        error: (error) => {
          console.error('Error loading all categories:', error);
          // Set empty array to avoid UI issues
          this.schoolCategories = [];
        }
      });
    } catch (error) {
      console.error('Error loading featured data:', error);
    }
  }

  loadCartCount() {
    this.cartService.cart$.subscribe(cart => {
      this.cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
    });
  }

  onSearchInput(event: any) {
    const query = event.target.value;
    if (query && query.length > 2) {
      // Implement search functionality or navigate to search page
      console.log('Search query:', query);
    }
  }

  getRatingStars(rating: number): number[] {
    return this.productHelpers.getRatingStars(rating);
  }
}
