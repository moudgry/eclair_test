import { Observable } from "rxjs";
import { Category } from "../models";
import { CategoryUpdateDTO } from "../dto";

export abstract class CategoryService {

  constructor() {}

  abstract getAllCategories(): Observable<Category[]>;

  abstract getCategory(id: string): Observable<Category>;

  abstract createCategory(category: CategoryUpdateDTO): Observable<Category>;

  abstract updateCategory(id: string, category: CategoryUpdateDTO): Observable<Category>;

  abstract deleteCategory(id: string): Observable<void>;

  abstract searchCategories(query: string): Observable<Category[]>;

  abstract getFeaturedCategories(): Observable<Category[]>;
}
