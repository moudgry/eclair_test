import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonBackButton, IonList, IonItem, IonNote, IonInput } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.css'],
  standalone: true,
  imports: [IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonBackButton, IonList, IonItem, IonNote, IonInput, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ResetPasswordPage {
  resetForm: FormGroup;
  email: string;
  otp: string

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private fb: FormBuilder
  ) {
    this.email = this.route.snapshot.queryParams['email'] || '';
    this.otp = this.route.snapshot.queryParams['otp'] || '';

    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  async resetPassword() {
    if (this.resetForm.invalid) return;

    try {
      await firstValueFrom(
        this.authService.resetPassword(
          this.email,
          this.otp,
          this.resetForm.value.newPassword
        )
      );

      const toast = await this.toastCtrl.create({
        message: 'Password reset successful!',
        duration: 3000,
        position: 'top',
        color: 'success'
      });
      toast.present();

      this.router.navigate(['/login']);
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Password reset failed. Please try again.',
        duration: 3000,
        position: 'top',
        color: 'danger'
      });
      toast.present();
    }
  }
}
