import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // ── Default redirect ──────────────────────────────────────────────────
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // ── Auth pages (guests only) ──────────────────────────────────────────
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      { path: 'login',          loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'register',       loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
      { path: 'forgot-password',loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
      { path: 'reset-password', loadComponent: () => import('./features/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
      { path: 'verify-2fa',     loadComponent: () => import('./features/auth/verify-2fa/verify-2fa.component').then(m => m.Verify2FAComponent) },
      { path: 'confirm-email',  loadComponent: () => import('./features/auth/confirm-email/confirm-email.component').then(m => m.ConfirmEmailComponent) },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  // ── Protected pages ───────────────────────────────────────────────────
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/user-profile/user-profile.component').then(m => m.UserProfileComponent)
  },

  // ── Admin only ────────────────────────────────────────────────────────
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent)
  },

  // ── Catch-all ─────────────────────────────────────────────────────────
  { path: '**', redirectTo: 'dashboard' }
];
