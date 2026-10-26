import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { AdminService } from '../../core/services/admin.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/auth.models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>

    <div class="container py-5">
      <h4 class="fw-bold mb-4"><i class="bi bi-people-fill me-2 text-danger"></i>Admin Panel — All Users</h4>

      <!-- Loading -->
      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
        <p class="text-muted mt-2">Loading users...</p>
      </div>

      <!-- Error -->
      <div *ngIf="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>

      <!-- Users Table -->
      <div *ngIf="!loading" class="card border-0 shadow-sm rounded-4">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th class="ps-4">Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Verified</th>
                  <th class="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of users">
                  <td class="ps-4">
                    <div class="d-flex align-items-center">
                      <div class="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                           style="width:38px;height:38px;">
                        <span class="text-primary fw-bold">{{ user.fullName.charAt(0) }}</span>
                      </div>
                      {{ user.fullName }}
                    </div>
                  </td>
                  <td class="text-muted">{{ user.email }}</td>
                  <td><span class="badge" [class]="user.role === 'Admin' ? 'bg-danger' : 'bg-secondary'">{{ user.role }}</span></td>
                  <td>
                    <i class="bi" [class]="user.isEmailConfirmed ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'"></i>
                  </td>
                  <td class="text-end pe-4">
                    <button class="btn btn-sm btn-outline-danger" (click)="deleteUser(user.id)"
                            [disabled]="deletingId === user.id">
                      <span *ngIf="deletingId === user.id" class="spinner-border spinner-border-sm"></span>
                      <i *ngIf="deletingId !== user.id" class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr *ngIf="users.length === 0">
                  <td colspan="5" class="text-center text-muted py-4">No users found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  `
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  loading = true;
  errorMsg = '';
  deletingId = '';

  constructor(private adminService: AdminService, private userService: UserService) {}

  ngOnInit(): void {
    this.adminService.getUsers().subscribe({
      next: users => { this.users = users; this.loading = false; },
      error: err => {
        this.errorMsg = err.error?.message || 'Failed to load users.';
        this.loading = false;
      }
    });
  }

  deleteUser(id: string): void {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    this.deletingId = id;
    this.userService.delete(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);
        this.deletingId = '';
      },
      error: () => this.deletingId = ''
    });
  }
}
