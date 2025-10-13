import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonList, IonItem, IonNote, IonButton, IonSpinner, IonInput } from '@ionic/angular/standalone';
import { AuthService } from '../../../services/auth.service';
import { lastValueFrom, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
  standalone: true,
  imports: [IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonInput, IonNote, IonButton, IonSpinner , CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class LoginPage {
  loginForm: FormGroup;
  isLoading = false;
  returnUrl = '/products'; // Default redirect

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Get return URL from route parameters or default to '/products'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  async login() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    try {
      await lastValueFrom(
        this.authService.login(this.loginForm.value).pipe(
          tap(() => this.router.navigateByUrl(this.returnUrl))
        )
      );
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Login failed. Please check your credentials.',
        duration: 3000,
        position: 'top',
        color: 'danger'
      });
      toast.present();
    } finally {
      this.isLoading = false;
    }
  }
}
