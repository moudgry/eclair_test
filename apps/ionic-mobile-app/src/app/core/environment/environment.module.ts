import { Injectable, NgModule } from '@angular/core';
import { environment } from '../../../environments/environment';

/*
@NgModule({
  providers: [
    { provide: 'ENVIRONMENT', useValue: environment }
  ]
})
export class EnvironmentModule {}
*/
@Injectable({ providedIn: 'root' })
export class EnvironmentService {
  get apiUrl() {
    return environment.apiUrl;
  }
}
