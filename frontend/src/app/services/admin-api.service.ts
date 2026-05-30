import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  totalRevenue: number;
}

export interface WardOccupancy {
  wardName: string;
  wardType: string;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
}

export interface Appointment {
  id: number;
  appointmentDate: string;
  status: string;
  tokenNumber: number;
  patient: { id: number; name: string; uhid: string };
  doctor: { id: number; name: string; uhid: string };
}

export interface Bill {
  id: number;
  amount: number;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly base = `${API_BASE_URL}/admin`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.base}/dashboard/stats`);
  }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.base}/appointments`);
  }

  getWardOccupancy(): Observable<WardOccupancy[]> {
    return this.http.get<WardOccupancy[]>(`${this.base}/wards/occupancy`);
  }

  getBills(): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.base}/bills`);
  }
}
