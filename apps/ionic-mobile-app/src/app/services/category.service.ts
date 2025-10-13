import { Injectable } from '@angular/core';
import { catchError, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { CategoryService as CoreCategoryService, Category, CategoryUpdateDTO, StateService } from '@eclair_commerce/core';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends CoreCategoryService {
  constructor(
    private api: ApiService,
    private authService: AuthService,
    private stateService: StateService
  ) {
    super();
  }

  getAllCategories(): Observable<Category[]> {
    console.log('Fetching all categories from API');

    // Check state first
    //const stateCategories = this.stateService.select('categories');

    return this.api.get<Category[]>('categories').pipe(
      tap(categories => {
        console.log(`Received ${categories.length} categories from API`);
        this.stateService.setCategories(categories);
      }),
      catchError(error => {
        console.error('Failed to get all categories:', error);
        //throw error; // Rethrow for component handling

        // Return empty array instead of throwing error
        return of([]);
      })
    );
  }

  getCategory(id: string): Observable<Category> {
    return this.api.get<Category>(`categories/${id}`).pipe(
      catchError(error => {
        console.error('Failed to get category:', error);
        throw error; // Rethrow for component handling
      })
    );
  }

  createCategory(category: CategoryUpdateDTO): Observable<Category> {
    return this.api.post<Category>('categories', category).pipe(
      tap(newCategory => {
        this.stateService.addCategory(newCategory); // Update state
      }),
      catchError(error => {
        console.error('Failed to create category:', error);
        throw error; // Rethrow for component handling
      })
    );
  }

  updateCategory(id: string, category: CategoryUpdateDTO): Observable<Category> {
    return this.api.put<Category>(`categories/${id}`, category).pipe(
      tap(updatedCategory => {
        this.stateService.updateCategory(updatedCategory); // Update state
      }),
      catchError(error => {
        console.error('Failed to update category:', error);
        throw error; // Rethrow for component handling
      })
    );
  }

  deleteCategory(id: string): Observable<void> {
    return this.api.delete<void>(`categories/${id}`).pipe(
        tap(() => {
          this.stateService.removeCategory(id); // Update state

          // Clear any cached data
          // Add this if you have caching mechanisms
      }),
      catchError(error => {
        console.error('Failed to delete category:', error);
        throw error; // Rethrow for component handling
      })
    );
  }

  searchCategories(query: string): Observable<Category[]> {
    /*
    return this.api.get<Category[]>(`categories?search=${query}`).pipe(
      catchError(error => {
        console.error('Failed to search categories:', error);
        throw error; // Rethrow for component handling
      })
    );
    */
    return this.api.get<Category[]>(`categories/search?q=${encodeURIComponent(query)}`).pipe(
      tap(categories => {
        console.log('API search results:', categories);
        if(categories && categories.length > 0) {
          return categories;
        } else {
          return of ([]);
        }
      }),
      catchError(error => {
        console.error('Search API error:', error);
        throw error; // Rethrow for component handling
        //return of ([]); // Return empty array instead of throwing
      })
    );
  }

  getFeaturedCategories(): Observable<Category[]> {
    console.log('Fetching featured categories from API');

    return this.api.get<Category[]>('categories/featured').pipe(
        tap(categories => {
          console.log(`Received ${categories.length} featured categories from API`);
        }),
        catchError(error => {
          console.error('Failed to get featured categories:', error);
          //throw error; // Rethrow for component handling

          // Fallback to all categories if featured endpoint fails
          return this.getAllCategories().pipe(
            map(categories => categories.slice(0, 4))
          );
        })
      );
  }
}
