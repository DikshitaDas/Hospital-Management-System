import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';
import {
  AddBedRequest,
  AddBloodStockRequest,
  AddDoctorRequest,
  AddDonorRequest,
  AddWardRequest,
  AdmitPatientRequest,
  Appointment,
  Bed,
  Bill,
  BloodAvailability,
  BloodRequest,
  BloodStock,
  BookAppointmentRequest,
  ChangePasswordRequest,
  CreateBillRequest,
  CreateBloodRequest,
  CreateLabTestRequest,
  CreatePrescriptionRequest,
  CreateUserRequest,
  DashboardStats,
  DoctorProfile,
  DonateBloodRequest,
  Donation,
  Donor,
  EmergencyAdmissionRequest,
  LabTest,
  Prescription,
  RescheduleAppointmentRequest,
  TransferPatientRequest,
  UpdateDoctorRequest,
  UpdateLabReportRequest,
  UpdatePatientRequest,
  UpdateProfileRequest,
  UpdateRoleRequest,
  UpdateWardRequest,
  User,
  Ward,
  WardOccupancy,
  Admission,
  Department,
  DepartmentRequest,
  Specialization,
  SpecializationRequest
} from '../admin/models/admin.models';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly base = `${API_BASE_URL}/admin`;
  private readonly patientBase = `${API_BASE_URL}/patient`;

  constructor(private http: HttpClient) {}

  // Dashboard
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.base}/dashboard/stats`);
  }

  // Patients
  getAllPatients(): Observable<User[]> {
    return this.http.get<User[]>(`${this.base}/patients`);
  }

  searchPatients(name: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.base}/patients/search`, { params: { name } });
  }

  updatePatient(id: number, body: UpdatePatientRequest): Observable<string> {
    return this.http.put(`${this.base}/patients/${id}`, body, { responseType: 'text' });
  }

  deletePatient(id: number): Observable<string> {
    return this.http.delete(`${this.base}/patients/${id}`, { responseType: 'text' });
  }

  createUser(body: CreateUserRequest): Observable<string> {
    return this.http.post(`${this.base}/users`, body, { responseType: 'text' });
  }

  getPatientPrescriptions(patientId: number): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.base}/patients/${patientId}/prescriptions`);
  }

  getPatientAdmissions(patientId: number): Observable<Admission[]> {
    return this.http.get<Admission[]>(`${this.patientBase}/${patientId}/admissions`);
  }

  // Doctors
  getAllDoctors(): Observable<DoctorProfile[]> {
    return this.http.get<DoctorProfile[]>(`${this.base}/doctors`);
  }

  searchDoctors(name: string): Observable<DoctorProfile[]> {
    return this.http.get<DoctorProfile[]>(`${this.base}/doctors/search`, { params: { name } });
  }

  addDoctor(body: AddDoctorRequest): Observable<string> {
    return this.http.post(`${this.base}/doctors`, body, { responseType: 'text' });
  }

  updateDoctor(userId: number, body: UpdateDoctorRequest): Observable<string> {
    return this.http.put(`${this.base}/doctors/${userId}`, body, { responseType: 'text' });
  }

  deleteDoctor(userId: number): Observable<string> {
    return this.http.delete(`${this.base}/doctors/${userId}`, { responseType: 'text' });
  }

  // Appointments
  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.base}/appointments`);
  }

  bookAppointment(body: BookAppointmentRequest): Observable<string> {
    return this.http.post(`${this.base}/appointments`, body, { responseType: 'text' });
  }

  cancelAppointment(id: number): Observable<string> {
    return this.http.put(`${this.base}/appointments/cancel/${id}`, {}, { responseType: 'text' });
  }

  rescheduleAppointment(id: number, body: RescheduleAppointmentRequest): Observable<string> {
    return this.http.put(`${this.base}/appointments/reschedule/${id}`, body, { responseType: 'text' });
  }

  approveAppointment(id: number): Observable<string> {
    return this.http.put(`${this.base}/appointments/approve/${id}`, {}, { responseType: 'text' });
  }

  // Wards & Beds
  getAllWards(): Observable<Ward[]> {
    return this.http.get<Ward[]>(`${this.base}/wards`);
  }

  addWard(body: AddWardRequest): Observable<string> {
    return this.http.post(`${this.base}/wards`, body, { responseType: 'text' });
  }

  updateWard(id: number, body: UpdateWardRequest): Observable<string> {
    return this.http.put(`${this.base}/wards/${id}`, body, { responseType: 'text' });
  }

  deleteWard(id: number): Observable<string> {
    return this.http.delete(`${this.base}/wards/${id}`, { responseType: 'text' });
  }

  getWardOccupancy(): Observable<WardOccupancy[]> {
    return this.http.get<WardOccupancy[]>(`${this.base}/wards/occupancy`);
  }

  addBed(body: AddBedRequest): Observable<string> {
    return this.http.post(`${this.base}/beds`, body, { responseType: 'text' });
  }

  getAvailableBeds(): Observable<Bed[]> {
    return this.http.get<Bed[]>(`${this.base}/beds/available`);
  }

  getAllBeds(): Observable<Bed[]> {
    return this.http.get<Bed[]>(`${this.base}/beds`);
  }

  // Admissions
  admitPatient(body: AdmitPatientRequest): Observable<string> {
    return this.http.post(`${this.base}/admissions`, body, { responseType: 'text' });
  }

  dischargePatient(patientId: number): Observable<string> {
    return this.http.put(`${this.base}/admissions/discharge/${patientId}`, {}, { responseType: 'text' });
  }

  transferPatient(body: TransferPatientRequest): Observable<string> {
    return this.http.put(`${this.base}/admissions/transfer`, body, { responseType: 'text' });
  }

  emergencyAdmission(body: EmergencyAdmissionRequest): Observable<string> {
    return this.http.post(`${this.base}/admissions/emergency`, body, { responseType: 'text' });
  }

  // Prescriptions
  getAllPrescriptions(): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.base}/prescriptions`);
  }

  createPrescription(body: CreatePrescriptionRequest): Observable<string> {
    return this.http.post(`${this.base}/prescriptions`, body, { responseType: 'text' });
  }

  // Billing
  getAllBills(): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.base}/bills`);
  }

  createBill(body: CreateBillRequest): Observable<string> {
    return this.http.post(`${this.base}/bills`, body, { responseType: 'text' });
  }

  payBill(id: number): Observable<string> {
    return this.http.put(`${this.base}/bills/pay/${id}`, {}, { responseType: 'text' });
  }

  // Blood bank
  getAllBloodStock(): Observable<BloodStock[]> {
    return this.http.get<BloodStock[]>(`${this.base}/blood-stock`);
  }

  addBloodStock(body: AddBloodStockRequest): Observable<string> {
    return this.http.post(`${this.base}/blood-stock`, body, { responseType: 'text' });
  }

  checkBloodAvailability(bloodGroup: string): Observable<BloodAvailability> {
    return this.http.get<BloodAvailability>(`${this.base}/blood-stock/${bloodGroup}`);
  }

  getAllBloodRequests(): Observable<BloodRequest[]> {
    return this.http.get<BloodRequest[]>(`${this.base}/blood-requests`);
  }

  requestBlood(body: CreateBloodRequest): Observable<string> {
    return this.http.post(`${this.base}/blood-requests`, body, { responseType: 'text' });
  }

  addDonor(body: AddDonorRequest): Observable<string> {
    return this.http.post(`${this.base}/donors`, body, { responseType: 'text' });
  }

  getAllDonors(): Observable<Donor[]> {
    return this.http.get<Donor[]>(`${this.base}/donors`);
  }

  donateBlood(body: DonateBloodRequest): Observable<string> {
    return this.http.post(`${this.base}/donations`, body, { responseType: 'text' });
  }

  getAllDonations(): Observable<Donation[]> {
    return this.http.get<Donation[]>(`${this.base}/donations`);
  }

  // Users & roles
  getUsersByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.base}/users/role/${role}`);
  }

  updateUserRole(id: number, body: UpdateRoleRequest): Observable<string> {
    return this.http.put(`${this.base}/users/${id}/role`, body, { responseType: 'text' });
  }

  // Admin profile
  getAdminProfile(adminId: number): Observable<User> {
    return this.http.get<User>(`${this.base}/profile/${adminId}`);
  }

  updateAdminProfile(adminId: number, body: UpdateProfileRequest): Observable<string> {
    return this.http.put(`${this.base}/profile/${adminId}`, body, { responseType: 'text' });
  }

  changePassword(adminId: number, body: ChangePasswordRequest): Observable<string> {
    return this.http.put(`${this.base}/profile/${adminId}/password`, body, { responseType: 'text' });
  }

  // Lab
  getAllLabTests(): Observable<LabTest[]> {
    return this.http.get<LabTest[]>(`${this.base}/lab-tests`);
  }

  createLabTest(body: CreateLabTestRequest): Observable<string> {
    return this.http.post(`${this.base}/lab-tests`, body, { responseType: 'text' });
  }

  updateLabReport(id: number, body: UpdateLabReportRequest): Observable<string> {
    return this.http.put(`${this.base}/lab-reports/${id}`, body, { responseType: 'text' });
  }

  // Departments & specializations (master data)
  getAllDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.base}/departments`);
  }

  addDepartment(body: DepartmentRequest): Observable<string> {
    return this.http.post(`${this.base}/departments`, body, { responseType: 'text' });
  }

  updateDepartment(id: number, body: DepartmentRequest): Observable<string> {
    return this.http.put(`${this.base}/departments/${id}`, body, { responseType: 'text' });
  }

  deleteDepartment(id: number): Observable<string> {
    return this.http.delete(`${this.base}/departments/${id}`, { responseType: 'text' });
  }

  getAllSpecializations(): Observable<Specialization[]> {
    return this.http.get<Specialization[]>(`${this.base}/specializations`);
  }

  addSpecialization(body: SpecializationRequest): Observable<string> {
    return this.http.post(`${this.base}/specializations`, body, { responseType: 'text' });
  }

  updateSpecialization(id: number, body: SpecializationRequest): Observable<string> {
    return this.http.put(`${this.base}/specializations/${id}`, body, { responseType: 'text' });
  }

  deleteSpecialization(id: number): Observable<string> {
    return this.http.delete(`${this.base}/specializations/${id}`, { responseType: 'text' });
  }
}
