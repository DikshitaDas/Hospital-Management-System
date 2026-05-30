export interface User {
  id: number;
  uhid: string;
  name: string;
  gender: string;
  age: number;
  mobile: string;
  role: string;
}

export interface DoctorProfile {
  id: number;
  specialization: string;
  department: string;
  consultationFee: number;
  availability: string;
  availabilityStatus?: string;
  user: User;
}

export interface Appointment {
  id: number;
  appointmentDate: string;
  status: string;
  tokenNumber: number;
  patient: User;
  doctor: User;
}

export interface Ward {
  id: number;
  wardName: string;
  wardType: string;
  totalBeds: number;
}

export interface Bed {
  id: number;
  bedNumber: string;
  status: string;
  ward: Ward;
}

export interface Admission {
  id: number;
  admissionDate: string;
  dischargeDate: string | null;
  status: string;
  patient: User;
  bed: Bed;
}

export interface Prescription {
  id: number;
  diagnosis: string;
  medicines: string;
  dosageInstructions: string;
  appointment: Appointment;
}

export interface Bill {
  id: number;
  amount: number;
  billType: string;
  status: string;
  billDate: string;
  patient: User;
}

export interface BloodStock {
  id: number;
  bloodGroup: string;
  unitsAvailable: number;
}

export interface BloodRequest {
  id: number;
  bloodGroup: string;
  unitsRequired: number;
  status: string;
  requestDate: string;
  patient: User;
}

export interface LabTest {
  id: number;
  testName: string;
  category: string;
  price: number;
  description: string;
}

export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  totalRevenue: number;
}

export interface WardOccupancy {
  wardName: string;
  wardType: string;
  plannedCapacity: number;
  bedsRegistered: number;
  occupiedBeds: number;
  availableBeds: number;
}

export interface Donor {
  id: number;
  donorName: string;
  bloodGroup: string;
  mobile: string;
}

export interface Donation {
  id: number;
  unitsDonated: number;
  donationDate: string;
  donor: Donor;
}

export interface BloodAvailability {
  bloodGroup: string;
  unitsAvailable: number;
  available: boolean;
}

export interface UpdatePatientRequest {
  name: string;
  gender: string;
  age: number;
  mobile: string;
}

export interface CreateUserRequest {
  name: string;
  gender: string;
  age: number;
  mobile: string;
  role: string;
  password: string;
}

export interface AddDoctorRequest {
  name: string;
  gender: string;
  age: number;
  mobile: string;
  password: string;
  specialization: string;
  department: string;
  consultationFee: number;
  availability: string;
}

export interface UpdateDoctorRequest {
  name: string;
  gender: string;
  age: number;
  mobile: string;
  specialization: string;
  department: string;
  consultationFee: number;
  availability: string;
}

export interface BookAppointmentRequest {
  patientId: number;
  doctorId: number;
  appointmentDate: string;
}

export interface RescheduleAppointmentRequest {
  appointmentDate: string;
}

export interface AddWardRequest {
  wardName: string;
  wardType: string;
  totalBeds: number;
}

export interface UpdateWardRequest {
  wardName: string;
  wardType: string;
  totalBeds: number;
}

export interface AddBedRequest {
  bedNumber: string;
  wardId: number;
}

export interface AdmitPatientRequest {
  patientId: number;
  bedId: number;
}

export interface TransferPatientRequest {
  patientId: number;
  newBedId: number;
}

export interface EmergencyAdmissionRequest {
  patientId: number;
  wardType: string;
}

export interface CreatePrescriptionRequest {
  appointmentId: number;
  diagnosis: string;
  medicines: string;
  dosageInstructions: string;
}

export interface CreateBillRequest {
  patientId: number;
  amount: number;
  billType: string;
}

export interface AddBloodStockRequest {
  bloodGroup: string;
  unitsAvailable: number;
}

export interface CreateBloodRequest {
  patientId: number;
  bloodGroup: string;
  unitsRequired: number;
}

export interface AddDonorRequest {
  donorName: string;
  bloodGroup: string;
  mobile: string;
}

export interface DonateBloodRequest {
  donorId: number;
  unitsDonated: number;
}

export interface CreateLabTestRequest {
  testName: string;
  category: string;
  price: number;
  description: string;
}

export interface UpdateLabReportRequest {
  result: string;
}

export interface UpdateRoleRequest {
  role: string;
}

export interface UpdateProfileRequest {
  name: string;
  gender: string;
  age: number;
  mobile: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
}

export interface Specialization {
  id: number;
  name: string;
  department?: Department | null;
}

export interface DepartmentRequest {
  name: string;
  description?: string;
}

export interface SpecializationRequest {
  name: string;
  departmentId?: number;
}
