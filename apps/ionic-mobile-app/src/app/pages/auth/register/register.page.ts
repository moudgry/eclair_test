import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonBackButton, IonButton, IonButtons, IonContent,
  IonHeader, IonInput, IonItem, IonLabel, IonList, IonNote,
  IonSpinner, IonTitle, IonToolbar
} from '@ionic/angular/standalone';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.css'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,IonInput ,
    IonLabel, IonList, IonItem, IonNote, IonButton,
    IonButtons, IonSpinner, IonLabel, IonBackButton,
    CommonModule, FormsModule, ReactiveFormsModule
  ]
})
export class RegisterPage {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // For quick testing, add this to ngOnInit
    /*
    this.registerForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });
    */

  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    // Only validate if both fields have values
    if (password?.value && confirmPassword?.value) {
      return password.value === confirmPassword.value ? null : { mismatch: true };
    }
    return null;
  }

  async register() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    try {
      /*
      // Extract only necessary fields
      const { firstName, lastName, email, password } = this.registerForm.value;

      this.authService.register({
        firstName,
        lastName,
        email,
        password
      }).subscribe((ret) => {
        alert(ret.firstName);
      })
      */

      //await this.authService.register(this.registerForm.value);
      this.authService.register(this.registerForm.value).subscribe(async(ret) => {
        const toast = await this.toastCtrl.create({
          message: `Registration successful for ${ret.firstName}! Please log in.`,
          duration: 3000,
          position: 'top',
          color: 'success'
        });
        toast.present();
        this.registerForm.reset();
        this.router.navigate(['/login']);
      })
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Registration failed. Please try again.',
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
