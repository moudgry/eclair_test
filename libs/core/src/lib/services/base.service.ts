import { Observable, catchError, throwError } from 'rxjs';
import { AppError } from '../utils';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

export abstract class BaseService {
  protected constructor(protected http: HttpClient, protected apiUrl: string) {}

  protected handleRequest<T>(request: Observable<T>): Observable<T> {
    return request.pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage = error.error?.message || error.message;
        return throwError(() => new AppError(errorMessage, error.status));
      })
    );
  }

  protected get<T>(endpoint: string): Observable<T> {
    return this.handleRequest(this.http.get<T>(`${this.apiUrl}/${endpoint}`));
  }

  protected post<T>(endpoint: string, body: any): Observable<T> {
    return this.handleRequest(this.http.post<T>(`${this.apiUrl}/${endpoint}`, body));
  }

  protected put<T>(endpoint: string, body: any): Observable<T> {
    return this.handleRequest(this.http.put<T>(`${this.apiUrl}/${endpoint}`, body));
  }

  protected delete<T>(endpoint: string): Observable<T> {
    return this.handleRequest(this.http.delete<T>(`${this.apiUrl}/${endpoint}`));
  }
}
