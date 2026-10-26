import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import {
  LoginDto, RegisterDto, AuthResponse,
  RefreshTokenDto, Verify2FADto, ResetPasswordDto,
  ForgotPasswordDto, User
} from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly usersUrl = `${environment.apiUrl}/users`;

  // ── Current user state ──────────────────────────────────────────────────
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // ── Auth API calls ──────────────────────────────────────────────────────

  register(dto: RegisterDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, dto);
  }

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, dto).pipe(
      tap(response => {
        if (!response.requiresTwoFactor) {
          this.saveUser(response);
        }
      })
    );
  }

  verify2FA(dto: Verify2FADto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/verify-2fa`, dto).pipe(
      tap(response => this.saveUser(response))
    );
  }

  confirmEmail(token: string, email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/confirm-email?token=${token}&email=${encodeURIComponent(email)}`);
  }

  forgotPassword(dto: ForgotPasswordDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, dto);
  }

  resetPassword(dto: ResetPasswordDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, dto);
  }

  refreshToken(): Observable<AuthResponse> {
    const token = this.getRefreshToken();
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, { refreshToken: token } as RefreshTokenDto).pipe(
      tap(response => this.saveUser(response))
    );
  }

  logout(): void {
    localStorage.removeItem('auth_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  // ── Helpers ─────────────────────────────────────────────────────────────

  get currentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value?.accessToken;
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'Admin';
  }

  getAccessToken(): string | null {
    return this.currentUser?.accessToken ?? null;
  }

  getRefreshToken(): string | null {
    return this.currentUser?.refreshToken ?? null;
  }

  private saveUser(user: AuthResponse): void {
    localStorage.setItem('auth_user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private loadUser(): AuthResponse | null {
    try {
      const stored = localStorage.getItem('auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
}
