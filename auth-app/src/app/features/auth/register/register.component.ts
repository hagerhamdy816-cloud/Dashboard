import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-vh-100 d-flex align-items-center bg-light">
      <div class="container py-4">
        <div class="row justify-content-center">
          <div class="col-md-5">

            <div class="card shadow-sm border-0 rounded-4">
              <div class="card-body p-5">

                <div class="text-center mb-4">
                  <div class="rounded-circle bg-success d-inline-flex align-items-center justify-content-center mb-3"
                       style="width:56px;height:56px;">
                    <i class="bi bi-person-plus-fill text-white fs-4"></i>
                  </div>
                  <h4 class="fw-bold mb-0">Create Account</h4>
                  <p class="text-muted small">Join us today</p>
                </div>

                <!-- Success -->
                <div *ngIf="successMsg" class="alert alert-success py-2 small">
                  {{ successMsg }}
                </div>

                <!-- Error -->
                <div *ngIf="errorMsg" class="alert alert-danger py-2 small">
                  {{ errorMsg }}
                </div>

                <form [formGroup]="form" (ngSubmit)="onSubmit()">

                  <div class="mb-3">
                    <label class="form-label fw-medium">Full Name</label>
                    <input type="text" class="form-control" formControlName="fullName"
                           placeholder="John Doe"
                           [class.is-invalid]="isInvalid('fullName')">
                    <div class="invalid-feedback">Full name is required.</div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-medium">Email</label>
                    <input type="email" class="form-control" formControlName="email"
                           placeholder="you@example.com"
                           [class.is-invalid]="isInvalid('email')">
                    <div class="invalid-feedback">Please enter a valid email.</div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-medium">Password</label>
                    <input type="password" class="form-control" formControlName="password"
                           placeholder="At least 8 characters"
                           [class.is-invalid]="isInvalid('password')">
                    <div class="invalid-feedback">
                      Password must be at least 8 characters.
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="form-label fw-medium">Confirm Password</label>
                    <input type="password" class="form-control" formControlName="confirmPassword"
                           placeholder="Repeat password"
                           [class.is-invalid]="isInvalid('confirmPassword') || form.hasError('mismatch')">
                    <div class="invalid-feedback">Passwords do not match.</div>
                  </div>

                  <button type="submit" class="btn btn-success w-100 py-2 fw-medium"
                          [disabled]="loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ loading ? 'Creating account...' : 'Create Account' }}
                  </button>

                </form>

                <p class="text-center text-muted small mt-4 mb-0">
                  Already have an account?
                  <a routerLink="/auth/login" class="text-decoration-none fw-medium">Sign in</a>
                </p>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  errorMsg = '';
  successMsg = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatch });
  }

  passwordMatch(group: AbstractControl) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c.touched);
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading = true;
    this.errorMsg = '';

    const { fullName, email, password } = this.form.value;

    this.auth.register({ fullName, email, password }).subscribe({
      next: () => {
        this.successMsg = 'Account created! Please check your email to verify your account.';
        this.loading = false;
      },
      error: err => {
        this.errorMsg = err.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
