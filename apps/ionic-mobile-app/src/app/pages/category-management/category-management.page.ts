import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, create, trash } from 'ionicons/icons';
import { CategoryService } from '../../services/category.service';
import { Category, CategoryUpdateDTO } from '@eclair_commerce/core';
import { AlertButton } from '@ionic/core';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.page.html',
  styleUrls: ['./category-management.page.css'],
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
    IonNote
  ]
})
export class CategoryManagementPage implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  selectedCategory: Category | null = null;
  isEditing = false;
  isCreating = false;
  searchQuery = '';
  isLoading = false;
  showDeleteAlert = false;
  categoryToDelete: Category | null = null;
  deleteAlertButtons: AlertButton[] = [];

  // Form model
  name = '';
  description = '';
  imageUrl = '';
  isFeatured = false;

  constructor(
    private categoryService: CategoryService,
    private toastCtrl: ToastController,
    private cdr: ChangeDetectorRef
    ) {
      addIcons({ add, create, trash });
      // Initialize alert buttons
      this.deleteAlertButtons = [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.showDeleteAlert = false;
            this.categoryToDelete = null;
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteCategory();
          }
        }
      ];
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.filteredCategories = [...categories];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
        this.isLoading = false;
        this.presentToast('Failed to load categories', 'danger');
      }
    });
  }

  searchCategories() {
    if (!this.searchQuery) {
      this.filteredCategories = [...this.categories];
      return;
    }

    this.categoryService.searchCategories(this.searchQuery).subscribe({
      next: (results) => {
        this.filteredCategories = results;
      },
      error: (err) => {
        console.error('Search failed', err);
        this.presentToast('Search failed', 'danger');
      }
    });
  }

  startCreate() {
    this.isCreating = true;
    this.isEditing = false;
    this.resetForm();
  }

  startEdit(category: Category) {
    this.selectedCategory = category;
    this.isEditing = true;
    this.isCreating = false;

    // Populate form with category data
    this.name = category.name;
    this.description = category.description || '';
    this.imageUrl = category.imageUrl || '';
    this.isFeatured = category.isFeatured || false;
  }

  resetForm() {
    this.name = '';
    this.description = '';
    this.imageUrl = '';
    this.isFeatured = false;
    this.selectedCategory = null;
  }

  cancelEdit() {
    this.isEditing = false;
    this.isCreating = false;
    this.resetForm();
  }

  saveCategory() {
    const categoryData: CategoryUpdateDTO = {
      name: this.name,
      slug: this.name.toLowerCase().replace(/\s+/g, '-'),
      description: this.description,
      imageUrl: this.imageUrl,
      isFeatured: this.isFeatured,
      sortOrder: 0
    };
    // Only add ID if we're editing
    if (this.isEditing && this.selectedCategory) {
      categoryData.id = this.selectedCategory.id;
    }

    if (this.isEditing && this.selectedCategory) {
      // Update existing category
      this.categoryService.updateCategory(this.selectedCategory.id, categoryData).subscribe({
        next: () => {
          this.loadCategories();
          this.cancelEdit();
          this.presentToast('Category updated successfully');
        },
        error: (err) => {
          console.error('Failed to update category', err);
          this.presentToast('Failed to update category', 'danger');
        }
      });
    } else if (this.isCreating) {
      // Create new category
      this.categoryService.createCategory(categoryData).subscribe({
        next: () => {
          this.loadCategories();
          this.cancelEdit();
          this.presentToast('Category created successfully');
        },
        error: (err) => {
          console.error('Failed to create category', err)
          this.presentToast('Failed to create category', 'danger');
        }
      });
    }
  }

  confirmDelete(category: Category) {
    this.categoryToDelete = category;
    this.showDeleteAlert = true;
  }

  deleteCategory() {
    if (this.categoryToDelete) {
      this.categoryService.deleteCategory(this.categoryToDelete.id).subscribe({
        next: () => {
          // Create new arrays instead of mutating existing ones
          this.categories = [...this.categories].filter(
            cat => cat.id !== this.categoryToDelete!.id
          );
          this.filteredCategories = [...this.filteredCategories].filter(
            cat => cat.id !== this.categoryToDelete!.id
          );
          this.showDeleteAlert = false;
          this.categoryToDelete = null;
          this.cdr.detectChanges(); // Manually trigger change detection
          this.presentToast('Category deleted successfully');
        },
        error: (err) => {
          console.error('Failed to delete category', err);
          this.presentToast('Failed to delete category', 'danger');
        }
      });
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

  trackByCategoryId(index: number, category: Category): string {
    return category.id;
  }
}
