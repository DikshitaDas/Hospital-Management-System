import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_BASE_URL } from '../core/api.config';

export interface RegisterRequest {
  name: string;
  gender: string;
  age: number;
  mobile: string;
  password: string;
}

export interface LoginRequest {
  uhid: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  role: string | null;
  uhid: string | null;
  name: string | null;
  userId: number | null;
  token: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = `${API_BASE_URL}/auth`;

  constructor(private http: HttpClient) {}

  register(payload: RegisterRequest): Observable<string> {
    return this.http.post(`${this.API}/register`, payload, { responseType: 'text' });
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API}/login`, payload).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem('hms_token', res.token);
          localStorage.setItem('hms_role', res.role ?? '');
          localStorage.setItem('hms_uhid', res.uhid ?? '');
          localStorage.setItem('hms_name', res.name ?? '');
          localStorage.setItem('hms_userId', String(res.userId ?? ''));
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('hms_token');
    localStorage.removeItem('hms_role');
    localStorage.removeItem('hms_uhid');
    localStorage.removeItem('hms_name');
    localStorage.removeItem('hms_userId');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('hms_token');
  }

  getToken(): string | null {
    return localStorage.getItem('hms_token');
  }

  getRole(): string | null {
    return localStorage.getItem('hms_role');
  }

  getName(): string | null {
    return localStorage.getItem('hms_name');
  }

  getUhid(): string | null {
    return localStorage.getItem('hms_uhid');
  }

  getUserId(): number | null {
    const id = localStorage.getItem('hms_userId');
    return id ? Number(id) : null;
  }

  getDashboardPath(): string {
    const role = this.getRole()?.toUpperCase();
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'DOCTOR') return '/doctor/dashboard';
    return '/patient/dashboard';
  }
}
