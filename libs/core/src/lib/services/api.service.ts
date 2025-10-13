import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders  } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AppError } from '../utils';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export abstract class ApiService extends BaseService {

  constructor(
    protected override http: HttpClient,
    protected override apiUrl: string
  ) {
    super(http, apiUrl);
  }

  override get<T>(endpoint: string, p0?: { headers: HttpHeaders; }): Observable<T> {
    if (!this.apiUrl) {
      console.warn('apiUrl not set in ApiService');
      return throwError(() => new Error('API URL not configured'));
    }
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, (p0) ? p0 : { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  override post<T>(endpoint: string, body: any, p0?: { headers: HttpHeaders; }): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, body, (p0) ? p0 : { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  override put<T>(endpoint: string, body: any, p0?: { headers: HttpHeaders; }): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, body, (p0) ? p0 : { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  override delete<T>(endpoint: string, p0?: { headers: HttpHeaders; }): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`, (p0) ? p0 : { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  protected getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  // Improved error handling
  private handleError = (error: HttpErrorResponse) => {
    const errorMessage = error.error?.message || error.message;
    return throwError(() => new AppError(errorMessage, error.status));
  };

  /*
  protected handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unexpected error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));

    //console.error('API Error:', error);
    //return throwError(() => ({
    //  message: error.message || 'Server error',
    //  status: error.status,
    //  originalError: error
    //}));
  }
  */
}
