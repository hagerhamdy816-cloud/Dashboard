import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>

    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6">

          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-body p-5">

              <!-- Avatar -->
              <div class="text-center mb-4">
                <div class="position-relative d-inline-block">
                  <div class="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mx-auto"
                       style="width:100px;height:100px;">
                    <span class="text-primary fw-bold fs-1">
                      {{ user?.fullName?.charAt(0) }}
                    </span>
                  </div>
                </div>
                <h5 class="fw-bold mt-3 mb-0">{{ user?.fullName }}</h5>
                <p class="text-muted small">{{ user?.email }}</p>
                <span class="badge bg-primary">{{ user?.role }}</span>
              </div>

              <!-- Upload Profile Picture -->
              <div class="mb-4">
                <label class="form-label fw-medium">Profile Picture</label>
                <div class="input-group">
                  <input type="file" class="form-control" accept="image/*"
                         (change)="onFileSelect($event)" #fileInput>
                  <button class="btn btn-primary" (click)="uploadPicture()" [disabled]="!selectedFile || uploading">
                    <span *ngIf="uploading" class="spinner-border spinner-border-sm me-1"></span>
                    Upload
                  </button>
                </div>
                <div *ngIf="uploadSuccess" class="text-success small mt-1">
                  <i class="bi bi-check me-1"></i>Picture uploaded!
                </div>
              </div>

              <!-- Info -->
              <div class="border rounded-3 p-3 bg-light">
                <h6 class="fw-bold mb-3 text-muted text-uppercase small">Account Details</h6>
                <div class="row mb-2">
                  <div class="col-5 text-muted small">Full Name</div>
                  <div class="col-7 fw-medium small">{{ user?.fullName }}</div>
                </div>
                <div class="row mb-2">
                  <div class="col-5 text-muted small">Email</div>
                  <div class="col-7 fw-medium small">{{ user?.email }}</div>
                </div>
                <div class="row">
                  <div class="col-5 text-muted small">Role</div>
                  <div class="col-7 small"><span class="badge bg-secondary">{{ user?.role }}</span></div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class UserProfileComponent {
  user = this.auth.currentUser;
  selectedFile: File | null = null;
  uploading = false;
  uploadSuccess = false;

  constructor(private auth: AuthService, private userService: UserService) {}

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
    this.uploadSuccess = false;
  }

  uploadPicture(): void {
    if (!this.selectedFile) return;
    this.uploading = true;
    this.userService.uploadProfilePicture(this.selectedFile).subscribe({
      next: () => {
        this.uploadSuccess = true;
        this.uploading = false;
        this.selectedFile = null;
      },
      error: () => this.uploading = false
    });
  }
}
