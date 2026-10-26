import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-vh-100 d-flex align-items-center bg-light">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-5">
            <div class="card shadow-sm border-0 rounded-4">
              <div class="card-body p-5 text-center">

                <!-- Loading -->
                <div *ngIf="loading">
                  <div class="spinner-border text-primary mb-3"></div>
                  <p class="text-muted">Verifying your email...</p>
                </div>

                <!-- Success -->
                <div *ngIf="!loading && success">
                  <div class="rounded-circle bg-success d-inline-flex align-items-center justify-content-center mb-3"
                       style="width:72px;height:72px;">
                    <i class="bi bi-check-lg text-white" style="font-size:2rem;"></i>
                  </div>
                  <h4 class="fw-bold">Email Confirmed!</h4>
                  <p class="text-muted">Your account is now verified. You can sign in.</p>
                  <a routerLink="/auth/login" class="btn btn-success px-5">Go to Login</a>
                </div>

                <!-- Error -->
                <div *ngIf="!loading && !success">
                  <div class="rounded-circle bg-danger d-inline-flex align-items-center justify-content-center mb-3"
                       style="width:72px;height:72px;">
                    <i class="bi bi-x-lg text-white" style="font-size:2rem;"></i>
                  </div>
                  <h4 class="fw-bold">Verification Failed</h4>
                  <p class="text-muted">{{ errorMsg }}</p>
                  <a routerLink="/auth/login" class="btn btn-outline-secondary px-5">Back to Login</a>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ConfirmEmailComponent implements OnInit {
  loading = true;
  success = false;
  errorMsg = '';

  constructor(private route: ActivatedRoute, private auth: AuthService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const email = params['email'];
      if (!token || !email) {
        this.loading = false;
        this.errorMsg = 'Invalid confirmation link.';
        return;
      }
      this.auth.confirmEmail(token, email).subscribe({
        next: () => { this.success = true; this.loading = false; },
        error: err => {
          this.errorMsg = err.error?.message || 'Confirmation link expired or invalid.';
          this.loading = false;
        }
      });
    });
  }
}
