// ─── Auth DTOs (match your .NET API) ───────────────────────────────────────

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  fullName: string;
  role: string;
  requiresTwoFactor?: boolean;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface Verify2FADto {
  email: string;
  twoFactorCode: string;
}

export interface ResetPasswordDto {
  email: string;
  token: string;
  newPassword: string;
}

export interface ForgotPasswordDto {
  email: string;
}

// ─── User Model ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isEmailConfirmed: boolean;
  profilePicture?: string;
  createdAt: string;
}

// ─── API Generic Response ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success: boolean;
  errors?: string[];
}
