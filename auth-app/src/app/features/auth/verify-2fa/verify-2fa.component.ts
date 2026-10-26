import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-2fa',
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
                  <div class="rounded-circle bg-info d-inline-flex align-items-center justify-content-center mb-3"
                       style="width:56px;height:56px;">
                    <i class="bi bi-shield-check text-white fs-4"></i>
                  </div>
                  <h4 class="fw-bold mb-0">Two-Factor Auth</h4>
                  <p class="text-muted small">Enter the 6-digit code sent to <strong>{{ email }}</strong></p>
                </div>

                <div *ngIf="errorMsg" class="alert alert-danger py-2 small">{{ errorMsg }}</div>

                <form [formGroup]="form" (ngSubmit)="onSubmit()">
                  <div class="mb-4">
                    <label class="form-label fw-medium">Verification Code</label>
                    <input type="text" class="form-control form-control-lg text-center"
                           formControlName="code" maxlength="6" placeholder="000000"
                           style="letter-spacing: 0.5rem; font-size: 1.5rem;"
                           [class.is-invalid]="form.get('code')?.invalid && form.get('code')?.touched">
                    <div class="invalid-feedback">Please enter a 6-digit code.</div>
                  </div>

                  <button type="submit" class="btn btn-info text-white w-100 py-2 fw-medium" [disabled]="loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                    Verify Code
                  </button>
                </form>

                <p class="text-center text-muted small mt-4 mb-0">
                  <a routerLink="/auth/login" class="text-decoration-none">← Back to Login</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class Verify2FAComponent implements OnInit {
  form: FormGroup;
  loading = false;
  errorMsg = '';
  email = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({ code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]] });
  }

  ngOnInit(): void {
    const state = history.state;
    this.email = state?.email || '';
    if (!this.email) this.router.navigate(['/auth/login']);
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.auth.verify2FA({ email: this.email, twoFactorCode: this.form.value.code }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => {
        this.errorMsg = err.error?.message || 'Invalid code. Please try again.';
        this.loading = false;
      }
    });
  }
}
