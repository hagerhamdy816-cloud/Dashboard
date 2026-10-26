import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// ── Protects routes that require login ──────────────────────────────────────
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn) return true;

  router.navigate(['/auth/login']);
  return false;
};

// ── Protects Admin-only routes ───────────────────────────────────────────────
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAdmin) return true;

  router.navigate(['/dashboard']);
  return false;
};

// ── Prevents logged-in users from going back to login page ──────────────────
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn) return true;

  router.navigate(['/dashboard']);
  return false;
};
