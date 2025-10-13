import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService as CoreApiService } from '@eclair_commerce/core';
import { EnvironmentService } from './environment.service';
import { catchError, from, Observable, switchMap, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ApiService extends CoreApiService {
  constructor(
    protected override http: HttpClient,
    private env: EnvironmentService,
    private tokenService: TokenService,
    private router: Router
  ) {
    super(http, env.apiUrl);
    this.apiUrl = env.apiUrl;
  }

  // Override getHeaders to include authentication token
  private async getAuthHeaders(): Promise<HttpHeaders> {
    const token = await this.tokenService.getToken();
    const vldToken = await this.tokenService.getValidToken(token);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (vldToken) {
      headers = headers.set('Authorization', `Bearer ${vldToken}`);
    }

    return headers;
  }

  private handleApiError(error: any): Observable<never> {
    if (error.status === 401) {
      // Handle unauthorized error
      this.router.navigate(['/login']);
    }
    return throwError(() => error);
  }

  // Override HTTP methods to use authenticated headers
  override get<T>(endpoint: string): Observable<T> {
    const fullUrl = `${this.apiUrl}/${endpoint}`;
    console.log('API Request URL:', fullUrl);

    return from(this.getAuthHeaders()).pipe(
      switchMap(headers => {
        console.log('Request headers:', headers);
        return super.get<T>(endpoint, { headers });
      }),
      catchError(error => this.handleApiError(error))
    );
  }

  override post<T>(endpoint: string, body: any): Observable<T> {
    return from(this.getAuthHeaders()).pipe(
      switchMap(headers => super.post<T>(endpoint, body, { headers }))
    );
  }

  override put<T>(endpoint: string, body: any): Observable<T> {
    return from(this.getAuthHeaders()).pipe(
      switchMap(headers => super.put<T>(endpoint, body, { headers }))
    );
  }

  override delete<T>(endpoint: string): Observable<T> {
    return from(this.getAuthHeaders()).pipe(
      switchMap(headers => super.delete<T>(endpoint, { headers }))
    );
  }
}
