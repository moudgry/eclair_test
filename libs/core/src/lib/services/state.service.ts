
import { Injectable } from "@angular/core";
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, Observable, scan, Subject } from "rxjs";
import { Product, Category } from "../models";

export interface AppState {
  products: Product[];
  categories: Category[];
  // Add other state properties as needed
}

const initialState: AppState = {
  products: [],
  categories: []
};

@Injectable({ providedIn: 'root' })
export class StateService {
  private state = new BehaviorSubject<AppState>(initialState);
  private updateQueue = new Subject<Partial<AppState>>();

  constructor() {
    this.setupUpdatePipeline();
  }

  private setupUpdatePipeline() {
    this.updateQueue.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      scan((state, update) => ({ ...state, ...update }), initialState)
    ).subscribe(this.state);
  }

  select<K extends keyof AppState>(key: K): Observable<AppState[K]> {
    return this.state.pipe(
      map(state => state[key]),
      distinctUntilChanged()
    );
  }

  update(update: Partial<AppState>): void {
    this.updateQueue.next(update);
  }

  // Helper methods for common operations
  addProduct(product: Product): void {
    const currentState = this.state.value;
    this.update({
      products: [...currentState.products, product]
    });
  }

  updateProduct(updatedProduct: Product): void {
    const currentState = this.state.value;
    this.update({
      products: currentState.products.map(p =>
        p.id === updatedProduct.id ? updatedProduct : p
      )
    });
  }

  removeProduct(productId: string): void {
    const currentState = this.state.value;
    this.update({
      products: currentState.products.filter(p => p.id !== productId)
    });
  }

  setProducts(products: Product[]): void {
    this.update({ products });
  }

  addCategory(category: Category): void {
    const currentState = this.state.value;
    this.update({
      categories: [...currentState.categories, category]
    });
  }

  updateCategory(updatedCategory: Category): void {
    const currentState = this.state.value;
    this.update({
      categories: currentState.categories.map(p =>
        p.id === updatedCategory.id ? updatedCategory : p
      )
    });
  }

  removeCategory(categoryId: string): void {
    const currentState = this.state.value;
    this.update({
      categories: currentState.categories.filter(p => p.id !== categoryId)
    });
  }

  setCategories(categories: Category[]): void {
    this.update({ categories });
  }
}
