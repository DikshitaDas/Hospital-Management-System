import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';
import { Appointment } from '../admin/models/admin.models';

export interface PatientDashboardStats {
  totalAppointments: number;
  totalPrescriptions: number;
  pendingBills: number;
  admitted: boolean;
}

export interface PatientProfile {
  id: number;
  uhid: string;
  name: string;
  gender: string;
  age: number;
  mobile: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class PatientApiService {
  private readonly base = `${API_BASE_URL}/patient`;

  constructor(private http: HttpClient) {}

  getDashboard(patientId: number): Observable<PatientDashboardStats> {
    return this.http.get<PatientDashboardStats>(`${this.base}/dashboard/${patientId}`);
  }

  getAppointments(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.base}/${patientId}/appointments`);
  }

  getProfile(): Observable<PatientProfile> {
    return this.http.get<PatientProfile>(`${this.base}/profile`);
  }
}
