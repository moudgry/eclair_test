import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonLabel, IonButton, IonButtons, IonList, IonItem, IonInput, IonSpinner } from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.page.html',
  styleUrls: ['./verify-otp.page.css'],
  standalone: true,
  imports: [IonSpinner, IonLabel, IonBackButton, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonList, IonItem, IonInput, CommonModule, FormsModule]
})
export class VerifyOtpPage {
  email: string;
  otp = '';
  isVerifying = false;
  showResend = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {
    this.email = this.route.snapshot.queryParams['email'] || '';
    // Show resend button after 30 seconds
    setTimeout(() => this.showResend = true, 30000);
  }

  onOtpInput(event: any) {
    this.otp = event.target.value.slice(0, 4);
  }

  async resendOtp() {
    try {
      await firstValueFrom(
        this.authService.requestPasswordReset(this.email)
      );

      const toast = await this.toastCtrl.create({
        message: 'New OTP sent to your email',
        duration: 3000,
        position: 'top',
        color: 'success'
      });
      toast.present();

      this.showResend = false;
      setTimeout(() => this.showResend = true, 30000);
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Failed to resend OTP. Please try again.',
        duration: 3000,
        position: 'top',
        color: 'danger'
      });
      toast.present();
    }
  }

  async verifyOtp() {
    if (!this.otp || this.otp.length !== 4) {
      const toast = await this.toastCtrl.create({
        message: 'Please enter a 4-digit OTP',
        duration: 3000,
        position: 'top',
        color: 'danger'
      });
      toast.present();
      return;
    }

    this.isVerifying = true;
    try {
      const isValid = await firstValueFrom(
        this.authService.verifyOtp(this.email, this.otp)
      );
      this.isVerifying = false;

      if (isValid) {
        this.router.navigate(['/reset-password'], {
          queryParams: { email: this.email, otp: this.otp }
        });
      } else {
        const toast = await this.toastCtrl.create({
          message: 'Invalid OTP code',
          duration: 3000,
          position: 'top',
          color: 'danger'
        });
        toast.present();
      }
    } catch (error) {
      this.isVerifying = false;
      const toast = await this.toastCtrl.create({
        message: 'Error verifying OTP. Please try again.',
        duration: 3000,
        position: 'top',
        color: 'danger'
      });
      toast.present();
    }
  }

}
