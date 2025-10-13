import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
  IonAlert,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonSpinner,
  IonCheckbox,
  IonButtons,
  IonText,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  ToastController,
  IonThumbnail
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, create, trash, image } from 'ionicons/icons';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product, Category, ProductUpdateDTO, StateService } from '@eclair_commerce/core';
import { AlertButton } from '@ionic/core';
import { EnvironmentService } from '../../services/environment.service'; // New service
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.page.html',
  styleUrls: ['./product-management.page.css'],
  standalone: true,
  imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      IonContent,
      IonHeader,
      IonTitle,
      IonToolbar,
      IonList,
      IonItem,
      IonLabel,
      IonInput,
      IonButton,
      IonButtons,
      IonIcon,
      IonSearchbar,
      IonText,
      IonGrid,
      IonRow,
      IonCol,
      IonAlert,
      IonItemSliding,
      IonItemOptions,
      IonItemOption,
      IonSpinner,
      IonCheckbox,
      IonNote,
      IonSelect,
      IonSelectOption,
      IonTextarea,
      IonThumbnail
    ]
})
export class ProductManagementPage implements OnInit {
  productForm!: FormGroup;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  selectedProduct: Product | null = null;
  isEditing = false;
  isCreating = false;
  searchQuery = '';
  isLoading = false;
  showDeleteAlert = false;
  productToDelete: Product | null = null;
  deleteAlertButtons: AlertButton[] = [];

  // Form model
  name = '';
  sku = '';
  price = 0;
  originalPrice = 0;
  discount = 0;
  discountedPrice = 0;
  description = '';
  shortDescription = '';
  imageUrl = '';
  categoryId = '';
  stock = 0;
  isFeatured = false;
  isActive = true;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private stateService: StateService,
    private toastCtrl: ToastController,
    private cdr: ChangeDetectorRef,
    private env: EnvironmentService,
    private fb: FormBuilder
    ) {
    addIcons({ add, create, trash, image });
    this.deleteAlertButtons = [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          this.showDeleteAlert = false;
          this.productToDelete = null;
        }
      },
      {
        text: 'Delete',
        role: 'destructive',
        handler: () => {
          this.deleteProduct();
        }
      }
    ];
    this.initForm();
  }

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();

    // Subscribe to state changes
    this.stateService.select('products').subscribe(products => {
      this.products = products;
      this.filteredProducts = [...products];
      this.cdr.detectChanges(); // Ensure UI updates
    });
  }

  private initForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      sku: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      originalPrice: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.min(0), Validators.max(100)]],
      description: [''],
      shortDescription: [''],
      imageUrl: [''],
      categoryId: ['', [Validators.required]],
      stock: [0, [Validators.required, Validators.min(0)]],
      isFeatured: [false],
      isActive: [true]
    });

    // Listen for changes to calculate discounted price
    this.productForm.get('originalPrice')?.valueChanges.subscribe(() => this.calculateDiscountedPrice());
    this.productForm.get('discount')?.valueChanges.subscribe(() => this.calculateDiscountedPrice());
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts(1, 100).subscribe({
      next: (products) => {
        // State will be updated via the subscription above

        this.products = products;
        this.filteredProducts = [...products];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.isLoading = false;
        this.presentToast('Failed to load products', 'danger');
      }
    });
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      }
    });
  }

  searchProducts() {
    console.log('Product management search with query:', this.searchQuery);

    if (!this.searchQuery) {
      this.filteredProducts = [...this.products];
      return;
    }

    this.productService.searchProducts(this.searchQuery).subscribe({
      next: (results) => {
        console.log('Product management search results:', results);
        this.filteredProducts = results;
      },
      error: (error) => {
        console.error('Product management search failed:', error);
        this.presentToast('Search failed', 'danger');
      }
    });
  }

  startCreate() {
    this.isCreating = true;
    this.isEditing = false;
    this.resetForm();
  }

  startEdit(product: Product) {
    this.selectedProduct = product;
    this.isEditing = true;
    this.isCreating = false;

    // Populate form with product data
    this.productForm.patchValue({
      name: product.name,
      sku: product.sku,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      discount: product.discount || 0,
      description: product.description,
      shortDescription: product.shortDescription,
      imageUrl: product.imageUrl,
      categoryId: product.categoryId,
      stock: product.stock,
      isFeatured: product.isFeatured,
      isActive: product.isActive
    });

    this.calculateDiscountedPrice();
  }

  resetForm() {
    this.productForm.reset({
      price: 0,
      originalPrice: 0,
      discount: 0,
      stock: 0,
      isFeatured: false,
      isActive: true
    });
    this.selectedProduct = null;
  }

  cancelEdit() {
    this.isEditing = false;
    this.isCreating = false;
    this.resetForm();
  }

  saveProduct() {
    if (this.productForm.invalid) return;

    const productData: ProductUpdateDTO = {
      ...this.productForm.value,
      slug: this.productForm.value.name.toLowerCase().replace(/\s+/g, '-'),
    };
    // Only add ID if we're editing
    if (this.isEditing && this.selectedProduct) {
      productData.id = this.selectedProduct.id;
    }

    if (this.isEditing && this.selectedProduct) {
      if (this.env.optimisticallyUpdate) {
        // Optimistically update the UI
        const updatedProducts = this.products.map(p =>
          p.id === this.selectedProduct?.id ? { ...p, ...productData } : p
        );
        this.products = updatedProducts;
        this.filteredProducts = updatedProducts;
        // Then make the API call
      }
      // Update existing product
      this.productService.updateProduct(this.selectedProduct.id, productData).subscribe({
        next: () => {
          // State will be updated automatically via the subscription

          this.loadProducts();
          this.cancelEdit();
          this.presentToast('Product updated successfully');
        },
        error: (err) => {
          console.error('Failed to update product', err);
          if (this.env.optimisticallyUpdate) {
            // Revert the optimistic update on error
            this.loadProducts(); // (true) Force refresh
          }
          this.presentToast('Failed to update product', 'danger');
        }
      });
    } else if (this.isCreating) {
      // Create new product
      this.productService.createProduct(productData).subscribe({
        next: () => {
          // State will be updated automatically via the subscription

          this.loadProducts();
          this.cancelEdit();
          this.presentToast('Product created successfully');
        },
        error: (err) => {
          console.error('Failed to create product', err);
          this.presentToast('Failed to create product', 'danger');
        }
      });
    }
  }

  confirmDelete(product: Product) {
    this.productToDelete = product;
    this.showDeleteAlert = true;
  }

  deleteProduct() {
    if (this.productToDelete) {
      this.productService.deleteProduct(this.productToDelete.id).subscribe({
        next: () => {
          // State will be updated automatically via the subscription

          // Create new arrays instead of mutating existing ones
          this.products = [...this.products].filter(
            prod => prod.id !== this.productToDelete!.id
          );
          this.filteredProducts = [...this.filteredProducts].filter(
            prod => prod.id !== this.productToDelete!.id
          );
          this.showDeleteAlert = false;
          this.productToDelete = null;
          this.cdr.detectChanges(); // Manually trigger change detection
          this.presentToast('Product deleted successfully');
        },
        error: (err) => {
          console.error('Failed to delete product', err);
          this.presentToast('Failed to delete product', 'danger');
        }
      });
    }
  }

  calculateDiscountedPrice() {
    const originalPrice = this.productForm.get('originalPrice')?.value || 0;
    const discount = this.productForm.get('discount')?.value || 0;

    if (originalPrice && discount) {
      const discountedPrice = originalPrice * (1 - discount / 100);
      this.productForm.patchValue({
        price: discountedPrice
      }, { emitEvent: false });
    }
  }

  private async presentToast(message: string, color = 'success') {
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
