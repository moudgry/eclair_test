import { Injectable } from '@angular/core';
import { EnvironmentService as CoreEnvironmentService } from '@eclair_commerce/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService extends CoreEnvironmentService {

  get apiUrl(): string {
    return environment.apiUrl;
  }

  get useExpirationWarning(): boolean {
    return environment.useExpirationWarning;
  }

  get optimisticallyUpdate(): boolean {
    return environment.optimisticallyUpdate;
  }
}
