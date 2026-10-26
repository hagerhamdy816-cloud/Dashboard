import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-vh-100 d-flex align-items-center bg-light">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-5">
            <div class="card shadow-sm border-0 rounded-4">
              <div class="card-body p-5">

                <div class="text-center mb-4">
                  <div class="rounded-circle bg-warning d-inline-flex align-items-center justify-content-center mb-3"
                       style="width:56px;height:56px;">
                    <i class="bi bi-key-fill text-white fs-4"></i>
                  </div>
                  <h4 class="fw-bold mb-0">Forgot Password?</h4>
                  <p class="text-muted small">Enter your email and we'll send a reset link</p>
                </div>

                <div *ngIf="successMsg" class="alert alert-success py-2 small">{{ successMsg }}</div>
                <div *ngIf="errorMsg" class="alert alert-danger py-2 small">{{ errorMsg }}</div>

                <form [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="!successMsg">
                  <div class="mb-4">
                    <label class="form-label fw-medium">Email</label>
                    <input type="email" class="form-control" formControlName="email"
                           placeholder="you@example.com"
                           [class.is-invalid]="form.get('email')?.invalid && form.get('email')?.touched">
                    <div class="invalid-feedback">Please enter a valid email.</div>
                  </div>

                  <button type="submit" class="btn btn-warning w-100 py-2 fw-medium" [disabled]="loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ loading ? 'Sending...' : 'Send Reset Link' }}
                  </button>
                </form>

                <p class="text-center text-muted small mt-4 mb-0">
                  <a routerLink="/auth/login" class="text-decoration-none">← Back to Sign In</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  form: FormGroup;
  loading = false;
  errorMsg = '';
  successMsg = '';

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.auth.forgotPassword(this.form.value).subscribe({
      next: () => {
        this.successMsg = 'Password reset link sent! Please check your inbox.';
        this.loading = false;
      },
      error: err => {
        this.errorMsg = err.error?.message || 'Failed to send reset link.';
        this.loading = false;
      }
    });
  }
}
