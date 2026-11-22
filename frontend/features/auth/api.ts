import { apiFetch } from '@/lib/api/client';

export interface AuthResponse {
  message: string;
  access_token: string;
}

export function loginWithEmail(
  email: string,
  password: string
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function loginWithGoogle(token: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/auth/google-login', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}