import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_BASE_URL } from '../core/api.config';
import {
  Appointment,
  Bill,
  BloodAvailability,
  ChangePasswordRequest,
  CreateBloodRequest,
  DoctorProfile,
  LabReport,
  PayBillRequest,
  Prescription,
  UpdateProfileRequest,
  User
} from '../admin/models/admin.models';

export interface PatientDashboardStats {
  totalAppointments: number;
  totalPrescriptions: number;
  pendingBills: number;
  admitted: boolean;
}

export interface PatientBookAppointmentRequest {
  doctorId: number;
  appointmentDate: string;
}

export interface RescheduleAppointmentRequest {
  appointmentDate: string;
}

@Injectable({ providedIn: 'root' })
export class PatientApiService {
  private readonly base = `${API_BASE_URL}/patient`;

  constructor(private http: HttpClient) {}

  getDashboard(patientId: number): Observable<PatientDashboardStats> {
    return this.http.get<PatientDashboardStats>(`${this.base}/dashboard/${patientId}`);
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.base}/profile`);
  }

  updateProfile(patientId: number, body: UpdateProfileRequest): Observable<string> {
    return this.http.put(`${this.base}/profile/${patientId}`, body, { responseType: 'text' });
  }

  changePassword(patientId: number, body: ChangePasswordRequest): Observable<string> {
    return this.http.put(`${this.base}/profile/${patientId}/password`, body, { responseType: 'text' });
  }

  getAppointments(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.base}/${patientId}/appointments`);
  }

  searchDoctors(name: string): Observable<User[]> {
    return this.http
      .get<DoctorProfile[]>(`${this.base}/doctors/search`, { params: { name: name.trim() } })
      .pipe(map(list => list.map(d => d.user)));
  }

  bookAppointment(body: PatientBookAppointmentRequest): Observable<string> {
    return this.http.post(`${this.base}/appointments`, body, { responseType: 'text' });
  }

  cancelAppointment(id: number): Observable<string> {
    return this.http.put(`${this.base}/appointments/${id}/cancel`, {}, { responseType: 'text' });
  }

  rescheduleAppointment(id: number, body: RescheduleAppointmentRequest): Observable<string> {
    return this.http.put(`${this.base}/appointments/${id}/reschedule`, body, { responseType: 'text' });
  }

  getPrescriptions(patientId: number): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.base}/${patientId}/prescriptions`);
  }

  getBills(patientId: number): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.base}/${patientId}/bills`);
  }

  payBill(billId: number, body: PayBillRequest): Observable<string> {
    return this.http.put(`${this.base}/bills/${billId}/pay`, body, { responseType: 'text' });
  }

  checkBloodAvailability(bloodGroup: string): Observable<BloodAvailability> {
    return this.http.get<BloodAvailability>(`${this.base}/blood-stock/${bloodGroup}`);
  }

  requestBlood(body: Omit<CreateBloodRequest, 'patientId'>): Observable<string> {
    return this.http.post(`${this.base}/blood-requests`, body, { responseType: 'text' });
  }

  getLabReports(patientId: number): Observable<LabReport[]> {
    return this.http.get<LabReport[]>(`${this.base}/${patientId}/lab-reports`);
  }
}
