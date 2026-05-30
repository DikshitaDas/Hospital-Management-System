import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';
import { Appointment } from './admin-api.service';

export interface DoctorDashboardStats {
  todayAppointments: number;
  totalPatients: number;
  pendingReports: number;
}

@Injectable({ providedIn: 'root' })
export class DoctorApiService {
  private readonly base = `${API_BASE_URL}/doctor`;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<DoctorDashboardStats> {
    return this.http.get<DoctorDashboardStats>(`${this.base}/dashboard`);
  }

  getTodayAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.base}/appointments/today`);
  }

  getPendingAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.base}/appointments/pending`);
  }
}
