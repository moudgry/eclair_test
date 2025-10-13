import { Injectable } from '@angular/core';
import { TokenService as CoreTokenService } from '@eclair_commerce/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class TokenService extends CoreTokenService {
  private readonly TOKEN_KEY = 'auth_token';
  constructor(private storage: Storage) {
    super();
    this.init();
  }

  private async init() {
    await this.storage.create();
  }

  async getToken(memoryCache: string | null = null): Promise<string | null> {
    try {
      // Check memory cache first
      if (memoryCache) {
        console.log('[AuthService] Using cached token');
        return memoryCache;
      }

      // Ensure storage is initialized
      if (!this.storage) {
        await this.init();
      }
      // Get from storage
      console.log('[AuthService] Retrieving token from storage');
      const token = await this.storage.get(this.TOKEN_KEY);

      if (token) {
        console.log('[AuthService] Token found in storage');
      } else {
        console.log('[AuthService] No token in storage');
      }
      return token;
    } catch (error) {
      console.error('[AuthService] Token retrieval error:', error);
      return null;
    }
  }

  StorageSet(token: string | null): void {
    this.storage.set(this.TOKEN_KEY, token);
    console.log('[AuthService] Add token to storage');
  }

  StorageRemove(): void {
    this.storage.remove(this.TOKEN_KEY);
    console.log('[AuthService] Remove token from storage');
  }

  decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Token decoding error:', e);
      return null;
    }
  }

  public async isTokenExpired(token: string | null = null): Promise<boolean> {
    if(!token) {
      token = await this.getToken();
    }
    const decoded = this.decodeToken(token as string);
    if (!decoded || !decoded.exp) return true;

    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(decoded.exp);

    return expirationDate.valueOf() < new Date().valueOf();
  }

  public async getValidToken(memoryCache: string | null = null): Promise<string | null> {
    const token = await this.getToken(memoryCache);
    if (!token || await this.isTokenExpired(token)) {
      // Add token refresh logic here
      return null;
    }
    return token;
  }
}
