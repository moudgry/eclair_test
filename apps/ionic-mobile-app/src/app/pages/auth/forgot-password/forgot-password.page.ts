import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonNote, IonSpinner, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.css'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonInput, IonItem, IonNote, IonButton, IonButtons, IonSpinner, IonLabel, IonBackButton, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ForgotPasswordPage {
  forgotForm: FormGroup;
  isSubmitted = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async submit() {
    this.isSubmitted = true;
    if (this.forgotForm.invalid) return;

    this.isLoading = true;
    try {
      //await this.authService.requestPasswordReset(this.forgotForm.value.email);
      this.authService.requestPasswordReset(this.forgotForm.value.email).subscribe(async (ret) => {
        const toast = await this.toastCtrl.create({
          message: 'OTP sent to your email',
          duration: 4000,
          position: 'top',
          color: 'success'
        });
        toast.present();
        this.router.navigate(['/verify-otp'], {
          queryParams: { email: this.forgotForm.value.email }
        });
      })
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Failed to send OTP. Please try again.',
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
