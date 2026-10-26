import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container">
        <a class="navbar-brand fw-bold" routerLink="/dashboard">
          <i class="bi bi-shield-lock me-2"></i>CleanAuth
        </a>

        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navMenu">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
                <i class="bi bi-house me-1"></i>Dashboard
              </a>
            </li>
            <li class="nav-item" *ngIf="auth.isAdmin">
              <a class="nav-link" routerLink="/admin" routerLinkActive="active">
                <i class="bi bi-gear me-1"></i>Admin
              </a>
            </li>
          </ul>

          <ul class="navbar-nav ms-auto align-items-center">
            <li class="nav-item me-2" *ngIf="auth.currentUser">
              <span class="text-muted small">
                <i class="bi bi-person-circle me-1"></i>
                {{ auth.currentUser.fullName }}
                <span class="badge bg-secondary ms-1">{{ auth.currentUser.role }}</span>
              </span>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/profile" routerLinkActive="active">
                <i class="bi bi-person me-1"></i>Profile
              </a>
            </li>
            <li class="nav-item">
              <button class="btn btn-sm btn-outline-danger ms-2" (click)="auth.logout()">
                <i class="bi bi-box-arrow-right me-1"></i>Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  constructor(public auth: AuthService) {}
}
