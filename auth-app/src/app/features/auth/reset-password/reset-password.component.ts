import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
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
                  <div class="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center mb-3"
                       style="width:56px;height:56px;">
                    <i class="bi bi-lock-fill text-white fs-4"></i>
                  </div>
                  <h4 class="fw-bold mb-0">Set New Password</h4>
                  <p class="text-muted small">Choose a strong password</p>
                </div>

                <div *ngIf="successMsg" class="alert alert-success py-2 small">
                  {{ successMsg }}
                  <a routerLink="/auth/login" class="ms-2 fw-medium">Go to Login</a>
                </div>
                <div *ngIf="errorMsg" class="alert alert-danger py-2 small">{{ errorMsg }}</div>

                <form [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="!successMsg">
                  <div class="mb-3">
                    <label class="form-label fw-medium">New Password</label>
                    <input type="password" class="form-control" formControlName="newPassword"
                           placeholder="At least 8 characters"
                           [class.is-invalid]="form.get('newPassword')?.invalid && form.get('newPassword')?.touched">
                    <div class="invalid-feedback">Password must be at least 8 characters.</div>
                  </div>

                  <div class="mb-4">
                    <label class="form-label fw-medium">Confirm Password</label>
                    <input type="password" class="form-control" formControlName="confirmPassword"
                           placeholder="Repeat password"
                           [class.is-invalid]="form.get('confirmPassword')?.touched && form.hasError('mismatch')">
                    <div class="invalid-feedback">Passwords do not match.</div>
                  </div>

                  <button type="submit" class="btn btn-primary w-100 py-2 fw-medium" [disabled]="loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    Reset Password
                  </button>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  loading = false;
  errorMsg = '';
  successMsg = '';
  private token = '';
  private email = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private route: ActivatedRoute) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: (g) => g.get('newPassword')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true } });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(p => {
      this.token = p['token'] || '';
      this.email = p['email'] || '';
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.auth.resetPassword({ email: this.email, token: this.token, newPassword: this.form.value.newPassword }).subscribe({
      next: () => {
        this.successMsg = 'Password reset successfully!';
        this.loading = false;
      },
      error: err => {
        this.errorMsg = err.error?.message || 'Reset failed. The link may have expired.';
        this.loading = false;
      }
    });
  }
}
