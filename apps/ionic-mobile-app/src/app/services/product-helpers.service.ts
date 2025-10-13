import { Injectable } from '@angular/core';
import { Product } from '@eclair_commerce/core';

@Injectable({
  providedIn: 'root'
})
export class ProductHelpersService {

  constructor() { }

  calculateDiscount(product: Product): number {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  }

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

  enhanceProducts(products: Product[]): Product[] {
    return products.map(product => this.enhanceProductWithDiscount(product));
  }

  getRatingStars(rating: number | string): number[] {
      // Convert to number if it's a string
      const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating;

      const stars = [];
      const fullStars = Math.floor(numericRating);
      const hasHalfStar = numericRating % 1 >= 0.5;

      for (let i = 0; i < fullStars; i++) {
        stars.push(1);
      }

      if (hasHalfStar) {
        stars.push(0.5);
      }

      while (stars.length < 5) {
        stars.push(0);
      }

      return stars;
  }
}
