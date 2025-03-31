import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  imports:[CommonModule , ReactiveFormsModule],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  private fb: FormBuilder = new FormBuilder();
  form = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });
  oobCode = '';
  error = '';
  success = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _authService:AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.oobCode = params['oobCode'] || '';
      if (!this.oobCode) this.error = 'Invalid reset link';
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  async onSubmit() {
    if (this.form.invalid || !this.oobCode) return;

    try {
      await this._authService.confirmPasswordReset(
        this.oobCode,
        this.form.value.password
      );
      this.success = true;
      this.error = '';
      setTimeout(() => this.router.navigate(['/login']), 2000);
    } catch (error: any) {
      this.error = this.getErrorMessage(error.code);
    }
  }

  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/expired-action-code':
        return 'Reset link has expired';
      case 'auth/invalid-action-code':
        return 'Invalid reset link';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      default:
        return 'Failed to reset password';
    }
  }
}