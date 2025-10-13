//import { AsyncPipe, CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';
import { EnvironmentService } from './services/environment.service';
import { register } from 'swiper/element/bundle';

register();

// For components that use multiple pipes, consider creating a shared imports array
//const commonImports = [AsyncPipe, DatePipe, CurrencyPipe, NgIf, NgFor];

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet,
    //commonImports,
    //AsyncPipe,
    //DatePipe,
    //CurrencyPipe,
    //NgFor
  ],
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private env: EnvironmentService
  ) {
    // Check token expiration every 30 seconds
    setInterval(async () => {
      await this.authService.checkTokenExpiration();
    }, 30000)
  }
}
