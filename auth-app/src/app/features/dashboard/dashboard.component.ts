import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../../shared/components/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>

    <div class="container py-5">

      <!-- Welcome Banner -->
      <div class="row mb-4">
        <div class="col">
          <div class="card border-0 bg-primary text-white rounded-4 shadow-sm p-4">
            <div class="d-flex align-items-center">
              <div class="rounded-circle bg-white bg-opacity-25 p-3 me-4">
                <i class="bi bi-person-circle text-white fs-2"></i>
              </div>
              <div>
                <h4 class="mb-0 fw-bold">Welcome, {{ user?.fullName }}! 👋</h4>
                <p class="mb-0 opacity-75">{{ user?.email }} · <span class="badge bg-white text-primary">{{ user?.role }}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row g-4 mb-4">
        <div class="col-md-4">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-body d-flex align-items-center p-4">
              <div class="rounded-3 bg-success bg-opacity-10 p-3 me-3">
                <i class="bi bi-check-circle-fill text-success fs-3"></i>
              </div>
              <div>
                <div class="text-muted small">Account Status</div>
                <div class="fw-bold fs-5">Active</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-body d-flex align-items-center p-4">
              <div class="rounded-3 bg-info bg-opacity-10 p-3 me-3">
                <i class="bi bi-shield-check text-info fs-3"></i>
              </div>
              <div>
                <div class="text-muted small">Security</div>
                <div class="fw-bold fs-5">JWT Protected</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-body d-flex align-items-center p-4">
              <div class="rounded-3 bg-warning bg-opacity-10 p-3 me-3">
                <i class="bi bi-person-badge text-warning fs-3"></i>
              </div>
              <div>
                <div class="text-muted small">Role</div>
                <div class="fw-bold fs-5">{{ user?.role }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="row g-3">
        <div class="col-md-6">
          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-body p-4">
              <h6 class="fw-bold mb-3"><i class="bi bi-lightning-fill text-warning me-2"></i>Quick Actions</h6>
              <div class="d-grid gap-2">
                <a routerLink="/profile" class="btn btn-outline-primary text-start">
                  <i class="bi bi-person me-2"></i>Edit Profile
                </a>
                <a *ngIf="isAdmin" routerLink="/admin" class="btn btn-outline-danger text-start">
                  <i class="bi bi-people me-2"></i>Admin Panel
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-body p-4">
              <h6 class="fw-bold mb-3"><i class="bi bi-info-circle text-info me-2"></i>Your Info</h6>
              <table class="table table-borderless table-sm mb-0">
                <tr>
                  <td class="text-muted">Name</td>
                  <td class="fw-medium">{{ user?.fullName }}</td>
                </tr>
                <tr>
                  <td class="text-muted">Email</td>
                  <td class="fw-medium">{{ user?.email }}</td>
                </tr>
                <tr>
                  <td class="text-muted">Role</td>
                  <td><span class="badge bg-primary">{{ user?.role }}</span></td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>

    </div>
  `
})
export class DashboardComponent {
  user = this.auth.currentUser;
  isAdmin = this.auth.isAdmin;
  constructor(public auth: AuthService) {}
}
