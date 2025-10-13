/*
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, from, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log(`[AuthInterceptor] Handling request to: ${request.url}`);

    // Skip adding token for authentication endpoints
    const authEndpoints = ['auth/login', 'auth/register', 'auth/request-reset', 'auth/verify-otp', 'auth/reset-password'];
    const isAuthRequest = authEndpoints.some(endpoint => request.url.includes(endpoint));
    if (isAuthRequest) {
      console.log('[AuthInterceptor] Skipping token for auth endpoint');
      return next.handle(request);
    }

    // Handle token for all other requests
    return from(this.tokenService.getToken()).pipe(
      switchMap(token => {
        console.log(`[AuthInterceptor] Token retrieved: ${token ? 'exists' : 'missing'}`);

        if (token) {
          const authReq = request.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
          });
          console.log('[AuthInterceptor] Adding token to request headers');
          return next.handle(authReq);
        }

        console.log('[AuthInterceptor] No token available');
        return next.handle(request);
      }),
      catchError(error => {
        // Handle token retrieval errors
        console.error('[AuthInterceptor] Error retrieving token:', error);
        return next.handle(request);
      })
    );
  }
}
*/
