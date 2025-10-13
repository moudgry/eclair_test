import { Injectable } from '@angular/core';
import { AuthService as CoreAuthService } from '@eclair_commerce/core';
import { ApiService } from './api.service';
import { User, SafeUser } from '@eclair_commerce/core';
import { BehaviorSubject, Observable, catchError, filter, finalize, firstValueFrom, forkJoin, from, interval, map, of, shareReplay, switchMap, tap, throwError, withLatestFrom } from 'rxjs';
import { Router } from '@angular/router';
import { EnvironmentService } from './environment.service'; // New service
import { TokenService } from './token.service';
import { ToastController } from '@ionic/angular/standalone';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthService extends CoreAuthService {
  private authState = new BehaviorSubject<boolean>(false);
  currentUser = new BehaviorSubject<SafeUser | null>(null);
  private isInitialized = false;
  private token: string | null = null;
  private refreshToken$: Observable<string> | null = null;
  private jwtHelper = new JwtHelperService();

  constructor(
    private api: ApiService,
    private router: Router,
    private env: EnvironmentService,
    private tokenService: TokenService,
    private toastCtrl: ToastController
    ) {
    super();
    this.init();
    //this.setupAutoRefresh();
  }

  private async init() {
    await this.checkToken();
    this.isInitialized = true;
  }

  public async waitForInitialization(): Promise<boolean> {
    if (this.isInitialized) {
      return true;
    }
    else {
      await this.init();
      return true;
    }
  }

  private async checkToken() {
    const token = await this.tokenService.getToken();
    if (token) {
      this.token = token;
      this.authState.next(true);
      // Fetch profile to validate token
      this.getProfile().subscribe({
        next: (user) => this.currentUser.next(user),
        error: async () => {
          console.error('Failed to get profile');
          await this.tokenService.StorageRemove();
          this.authState.next(false);
        }
      });
    }
    else {
      this.authState.next(false);
    }
  }

  async setToken(token: string | null) {
    this.token = token; // Store token immediately
    await this.tokenService.StorageSet(this.token);
  }

  /*
  private setupAutoRefresh(): void {
    // Auto-refresh token before expiration
    interval(30000).pipe(
      withLatestFrom(this.isAuthenticated()),
      filter(([_, isAuth]) => isAuth),
      switchMap(() => this.tokenService.getToken()),
      filter(token => !!token),
      switchMap(token =>
        forkJoin([
          of(token),
          this.tokenService.isTokenExpired(token!)
        ])
      ),
      filter(([token, isExpired]) => isExpired),
      switchMap(() => this.refreshAuthToken())
    ).subscribe();
  }
  */

  async refreshAuthToken(): Promise<string> {
    if (this.refreshToken$) {
      return firstValueFrom(this.refreshToken$);
    }

    this.refreshToken$ = this.api.post<{ token: string }>('auth/refresh', {}).pipe(
      map(response => response.token),
      tap(token => this.setToken(token)),
      finalize(() => this.refreshToken$ = null),
      shareReplay(1)
    );
    /*
    const toast = await this.toastCtrl.create({
      message: 'Token refreshed successfully',
      duration: 2000,
      position: 'top'
    });
    toast.present();
    */
    return firstValueFrom(this.refreshToken$);
  }

  /*
  refreshToken(): Observable<string> {
    return this.api.post<{ token: string }>('auth/refresh', {}).pipe(
      map(res => res.token)
    );
  }

  private async handleTokenRefresh(): Promise<string | null> {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) return null;

      const response = await firstValueFrom(
        this.api.post<{ token: string }>('auth/refresh', { refreshToken })
      );

      await this.setToken(response.token);
      return response.token;
    } catch (error) {
      await this.logout();
      return null;
    }
  }
  */

  async checkTokenExpiration() {
    const token = await this.tokenService.getToken();
    const expiration = this.jwtHelper.getTokenExpirationDate(token as string);
    const minutesLeft = Math.floor(((expiration as Date).getTime() - Date.now()) / 60000);

    if (minutesLeft < 1) {
      await this.expirationProcedure();
    }
    else if (minutesLeft < 2) {
      if (this.env.useExpirationWarning) {
        const toast = await this.toastCtrl.create({
          message: 'Your session will expire soon',
          duration: 2000,
          position: 'top'
        });
        toast.present();
      } else {
        this.refreshAuthToken();
      }
    }
  }

  async expirationProcedure() {
    if (this.isAuthenticated() && await this.tokenService.isTokenExpired()) {
      this.logout();
      const toast = await this.toastCtrl.create({
        message: 'Your session is expired',
        duration: 2000,
        position: 'top'
      });
      toast.present();
    }
  }

  register(user: User) {
    return this.api.post<SafeUser>('auth/register', user);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.api.post<{ token: string }>('auth/login', credentials).pipe(
      tap(async (res: any) => {
          await this.setToken(res.token);
          console.log('Token content:', this.tokenService.decodeToken(res.token));
          this.getProfile().subscribe({
            error: () => {
              console.error('Failed to get profile');
            }
          });
          this.authState.next(true);
        }),
      catchError(async error => {
        await this.tokenService.StorageRemove();
        this.authState.next(false);
        return throwError(() => error);
      })
    );
  }

  getProfile() {
    return this.api.get<SafeUser>('profile').pipe(
      tap(user => {
        this.currentUser.next(user)
        console.log('Login successful for:', user.email);
      }),
      catchError(error => {
        console.error('Login Failed:', error);
        throw error; // Rethrow for component handling
      })
    );
  }

  async logout() {
    this.token = null;
    await this.tokenService.StorageRemove();
    this.authState.next(false);
    this.currentUser.next(null);
    this.router.navigate(['/login']);
  }

  async getValidToken(): Promise<string | null> {
    const token = await this.tokenService.getValidToken(this.token);
    if (!token) {
      await this.logout();
      return null;
    }
    return token;
  }

  isAuthenticated(): Observable<boolean> {
    return this.authState.asObservable();
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.api.post('auth/request-reset', { email });
  }

  verifyOtp(email: string, otp: string): Observable<boolean> {
    return this.api.post<{ valid: boolean }>('auth/verify-otp', { email, otp }).pipe(
      map(response => response.valid)
    );
  }

  resetPassword(email: string, otp: string, newPassword: string): Observable<any> {
    return this.api.post('auth/reset-password', { email, otp, newPassword });
  }
}
