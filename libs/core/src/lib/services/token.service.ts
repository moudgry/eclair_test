export abstract class TokenService {

  constructor() {}

  abstract getToken(memoryCache: string | null): Promise<string | null>;

  abstract StorageSet(token: string | null): void;

  abstract StorageRemove(): void;

  abstract decodeToken(token: string): any;

  abstract isTokenExpired(token: string | null): Promise<boolean>;

  abstract getValidToken(memoryCache: string | null): Promise<string | null>;
}
