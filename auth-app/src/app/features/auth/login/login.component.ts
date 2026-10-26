import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-vh-100 d-flex align-items-center bg-light">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-5">

            <!-- Card -->
            <div class="card shadow-sm border-0 rounded-4">
              <div class="card-body p-5">

                <!-- Logo / Header -->
                <div class="text-center mb-4">
                  <div class="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center mb-3"
                       style="width:56px;height:56px;">
                    <i class="bi bi-shield-lock-fill text-white fs-4"></i>
                  </div>
                  <h4 class="fw-bold mb-0">Welcome Back</h4>
                  <p class="text-muted small">Sign in to your account</p>
                </div>

                <!-- Error Alert -->
                <div *ngIf="errorMsg" class="alert alert-danger py-2 small">
                  {{ errorMsg }}
                </div>

                <!-- Form -->
                <form [formGroup]="form" (ngSubmit)="onSubmit()">

                  <div class="mb-3">
                    <label class="form-label fw-medium">Email</label>
                    <input type="email" class="form-control" formControlName="email"
                           placeholder="you@example.com"
                           [class.is-invalid]="isInvalid('email')">
                    <div class="invalid-feedback">Please enter a valid email.</div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-medium d-flex justify-content-between">
                      Password
                      <a routerLink="/auth/forgot-password" class="text-decoration-none small">Forgot password?</a>
                    </label>
                    <input type="password" class="form-control" formControlName="password"
                           placeholder="••••••••"
                           [class.is-invalid]="isInvalid('password')">
                    <div class="invalid-feedback">Password is required.</div>
                  </div>

                  <button type="submit" class="btn btn-primary w-100 py-2 mt-2 fw-medium"
                          [disabled]="loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ loading ? 'Signing in...' : 'Sign In' }}
                  </button>

                </form>

                <!-- Footer -->
                <p class="text-center text-muted small mt-4 mb-0">
                  Don't have an account?
                  <a routerLink="/auth/register" class="text-decoration-none fw-medium">Sign up</a>
                </p>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  errorMsg = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c.touched);
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading = true;
    this.errorMsg = '';

    this.auth.login(this.form.value).subscribe({
      next: res => {
        if (res.requiresTwoFactor) {
          // Redirect to 2FA page, pass email via state
          this.router.navigate(['/auth/verify-2fa'], { state: { email: this.form.value.email } });
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: err => {
        this.errorMsg = err.error?.message || 'Login failed. Please check your credentials.';
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }
}
