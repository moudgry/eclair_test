import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton, IonButton, IonButtons, IonContent, IonHeader,
  IonIcon, IonImg, IonLabel, IonItem, IonTitle, IonToolbar,
  IonBadge, IonAvatar,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonCardContent, ToastController, IonInput
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { Product } from '@eclair_commerce/core';
import { ProductService } from '../../services/product.service';
import { ProductHelpersService } from '../../services/product-helpers.service';
import { CartService } from '../../services/cart.service';
import { addIcons } from 'ionicons';
import {
  shareSocialOutline, heartOutline, heart, cartOutline, star,
  starHalf, starOutline, arrowRedoOutline, flagOutline,
  chevronDownOutline, createOutline
} from 'ionicons/icons';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

const MOCK_REVIEWS = [
  {
    id: '1',
    userName: 'John Doe',
    userPhoto: 'assets/images/avatars/1.jpg',
    rating: 5,
    title: 'Excellent product!',
    date: new Date('2023-10-15'),
    comment: 'This product exceeded my expectations. The quality is outstanding and it arrived quickly.',
    helpful: 12
  },
  {
    id: '2',
    userName: 'Jane Smith',
    userPhoto: 'assets/images/avatars/2.jpg',
    rating: 4,
    title: 'Good value for money',
    date: new Date('2023-09-22'),
    comment: 'I\'ve been using this for a month now and it works well. Would recommend to others.',
    helpful: 8
  }
];

const MOCK_SIMILAR_PRODUCTS: Product[] = [
  {
    id: '2',
    name: 'Similar Product 1',
    sku: 'SIM001',
    price: 79.99,
    description: 'Description for similar product 1',
    shortDescription: 'Short description for similar product 1',
    imageUrl: 'assets/images/products/similar1.jpg',
    categoryId: '1',
    stock: 10,
    isFeatured: false,
    isActive: true,
    rating: 4.5,
    reviewCount: 24
  },
  {
    id: '3',
    name: 'Similar Product 2',
    sku: 'SIM002',
    price: 89.99,
    description: 'Description for similar product 2',
    shortDescription: 'Short description for similar product 2',
    imageUrl: 'assets/images/products/similar2.jpg',
    categoryId: '1',
    stock: 15,
    isFeatured: false,
    isActive: true,
    rating: 4.2,
    reviewCount: 18
  },
  {
    id: '4',
    name: 'Similar Product 3',
    sku: 'SIM003',
    price: 69.99,
    description: 'Description for similar product 3',
    shortDescription: 'Short description for similar product 3',
    imageUrl: 'assets/images/products/similar3.jpg',
    categoryId: '1',
    stock: 8,
    isFeatured: false,
    isActive: true,
    rating: 4.7,
    reviewCount: 32
  }
];

const MOCK_RECOMMENDED_PRODUCTS: Product[] = [
  {
    id: '5',
    name: 'Recommended Product 1',
    sku: 'REC001',
    price: 99.99,
    description: 'Description for recommended product 1',
    shortDescription: 'Short description for recommended product 1',
    imageUrl: 'assets/images/products/recommended1.jpg',
    categoryId: '1',
    stock: 12,
    isFeatured: false,
    isActive: true,
    rating: 4.8,
    reviewCount: 45
  },
  {
    id: '6',
    name: 'Recommended Product 2',
    sku: 'REC002',
    price: 59.99,
    description: 'Description for recommended product 2',
    shortDescription: 'Short description for recommended product 2',
    imageUrl: 'assets/images/products/recommended2.jpg',
    categoryId: '1',
    stock: 20,
    isFeatured: false,
    isActive: true,
    rating: 4.3,
    reviewCount: 22
  },
  {
    id: '7',
    name: 'Recommended Product 3',
    sku: 'REC003',
    price: 79.99,
    description: 'Description for recommended product 3',
    shortDescription: 'Short description for recommended product 3',
    imageUrl: 'assets/images/products/recommended3.jpg',
    categoryId: '1',
    stock: 5,
    isFeatured: false,
    isActive: true,
    rating: 4.6,
    reviewCount: 38
  }
];
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.css'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton,
    IonBackButton, IonIcon, IonImg, IonItem, IonLabel,
    IonBadge, IonAvatar,
    IonCard, IonCardHeader, IonCardTitle,
    IonCardSubtitle, IonCardContent, IonButtons,
    CommonModule, FormsModule, ProductCardComponent, IonInput
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductDetailPage implements OnInit {
  product!: Product;
  quantity = 1;
  isInWatchlist = false;
  productImages: string[] = [];
  similarProducts = MOCK_SIMILAR_PRODUCTS;
  recommendedProducts = MOCK_RECOMMENDED_PRODUCTS; // In a real app, this would be different
  reviews = MOCK_REVIEWS;
  showAllReviews = false;
  swiperConfig = {
    slidesPerView: 1,
    spaceBetween: 10,
    pagination: true,
    navigation: true
  };
  similarSwiperConfig = {
    slidesPerView: 3,
    spaceBetween: 10,
    breakpoints: {
      640: { slidesPerView: 3.5 },
      768: { slidesPerView: 4.5 },
      1024: { slidesPerView: 5.5 }
    }
  };

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private productHelpers: ProductHelpersService,
    private toastCtrl: ToastController
  ) {
    addIcons({
      shareSocialOutline, heartOutline, heart, cartOutline, star,
      starHalf, starOutline, arrowRedoOutline, flagOutline,
      chevronDownOutline, createOutline
    });
  }

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }
  }

  loadProduct(id: string) {
    this.productService.getProduct(id).subscribe(product => {
      this.product = product;

      // Create array of product images (main image + gallery)
      this.productImages = [product.imageUrl];
      if (product.gallery && product.gallery.length > 0) {
        this.productImages = [...this.productImages, ...product.gallery];
      }

      // Enhance product with discount calculation
      this.product = this.productHelpers.enhanceProductWithDiscount(product);
    });
  }

  addToCart() {
    this.cartService.addToCart(this.product, this.quantity);
    this.presentToast('Product added to cart');
  }

  toggleWatchlist() {
    this.isInWatchlist = !this.isInWatchlist;
    const message = this.isInWatchlist
      ? 'Added to watchlist'
      : 'Removed from watchlist';
    this.presentToast(message);
  }

  shareProduct() {
    // In a real app, this would use the Web Share API or a social sharing plugin
    this.presentToast('Product shared');
  }

  getRatingStars(rating: number): number[] {
    return this.productHelpers.getRatingStars(rating);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  markHelpful(review: any) {
    review.helpful++;
    this.presentToast('Marked as helpful');
  }

  shareReview(review: any) {
    this.presentToast('Review shared');
  }

  reportReview(review: any) {
    this.presentToast('Review reported');
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }

  trackByReviewId(index: number, review: any): string {
    return review.id;
  }
}
