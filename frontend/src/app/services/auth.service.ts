import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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
  token: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:8080/api/auth';

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
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('hms_token');
    localStorage.removeItem('hms_role');
    localStorage.removeItem('hms_uhid');
    localStorage.removeItem('hms_name');
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
}
