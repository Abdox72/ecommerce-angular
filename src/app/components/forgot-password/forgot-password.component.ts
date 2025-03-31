import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule , ReactiveFormsModule],
  templateUrl: './forgot-password.component.html'

})
export class ForgotPasswordComponent {
  private fb: FormBuilder = new FormBuilder();
  form:FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });
  success = false;
  error = '';

  constructor(
    private _authService: AuthService
  ) {}

  async onSubmit() {
    if (this.form.invalid) return;

    try {
      await this._authService.sendPasswordResetEmail(this.form.value.email);
      this.success = true;
      this.error = '';
    } catch (error: any) {
      this.error = this.getErrorMessage(error.code);
      this.success = false;
    }
  }

  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
        return 'No user found with this email';
      case 'auth/invalid-email':
        return 'Invalid email address';
      default:
        return 'Failed to send reset email';
    }
  }
}