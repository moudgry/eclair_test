import { Observable } from 'rxjs';
import { User, SafeUser } from '../models';

export abstract class AuthService {

  constructor() {}

  abstract login(credentials: { email: string; password: string }): Observable<{ token: string }>;

  abstract register(user: User): Observable<SafeUser>;

  abstract logout(): Promise<void>;

  abstract getProfile(): Observable<SafeUser>;

  abstract requestPasswordReset(email: string): Observable<any>;

  abstract verifyOtp(email: string, otp: string): Observable<boolean>;

  abstract resetPassword(email: string, otp: string, newPassword: string): Observable<any>;

  abstract isAuthenticated(): Observable<boolean>;

  //abstract getCurrentUser(): Observable<SafeUser | null>;

  //abstract getToken(): Promise<string | null>;

  abstract setToken(token: string): Promise<void>;

  //abstract removeToken(): Promise<void>;

  /*
  // Token management
  protected async getToken(): Promise<string | null> {
    return this.storage.getItem(this.config.authTokenKey);
  }

  protected async setToken(token: string): Promise<void> {
    return this.storage.setItem(this.config.authTokenKey, token);
  }

  protected async removeToken(): Promise<void> {
    return this.storage.removeItem(this.config.authTokenKey);
  }
  */
}
