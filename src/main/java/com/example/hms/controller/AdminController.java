package com.example.hms.controller;

import com.example.hms.dto.ChangePasswordRequest;
import com.example.hms.dto.UpdateProfileRequest;
import com.example.hms.dto.Lab.CreateLabTestRequest;
import com.example.hms.dto.Lab.UpdateLabReportRequest;
import com.example.hms.dto.admin.AddBedRequest;
import com.example.hms.dto.admin.AddBloodStockRequest;
import com.example.hms.dto.admin.AddDoctorRequest;
import com.example.hms.dto.admin.AddDonorRequest;
import com.example.hms.dto.admin.AddWardRequest;
import com.example.hms.dto.admin.AdmitPatientRequest;
import com.example.hms.dto.admin.BloodAvailabilityResponse;
import com.example.hms.dto.admin.BookAppointmentRequest;
import com.example.hms.dto.admin.CreateBillRequest;
import com.example.hms.dto.admin.CreateBloodRequest;
import com.example.hms.dto.admin.CreatePrescriptionRequest;
import com.example.hms.dto.admin.CreateUserRequest;
import com.example.hms.dto.admin.DashboardStatsResponse;
import com.example.hms.dto.admin.DonateBloodRequest;
import com.example.hms.dto.admin.EmergencyAdmissionRequest;
import com.example.hms.dto.admin.RescheduleAppointmentRequest;
import com.example.hms.dto.admin.TransferPatientRequest;
import com.example.hms.dto.admin.UpdateDoctorRequest;
import com.example.hms.dto.admin.UpdatePatientRequest;
import com.example.hms.dto.admin.UpdateRoleRequest;
import com.example.hms.dto.admin.UpdateWardRequest;
import com.example.hms.dto.admin.WardOccupancyResponse;
import com.example.hms.entity.Appointment;
import com.example.hms.entity.Bed;
import com.example.hms.entity.Bill;
import com.example.hms.entity.BloodRequest;
import com.example.hms.entity.BloodStock;
import com.example.hms.entity.DoctorProfile;
import com.example.hms.entity.LabTest;
import com.example.hms.entity.Prescription;
import com.example.hms.entity.User;
import com.example.hms.entity.Ward;
import com.example.hms.service.AdminService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")

public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/patients")
    public List<User> getAllPatients() {

        return adminService.getAllPatients();
    }

    @GetMapping("/patients/search")
    public List<User> searchPatients(
            @RequestParam String name) {

        return adminService.searchPatients(name);
    }

    @DeleteMapping("/patients/{id}")
    public String deletePatient(
            @PathVariable Long id) {

        return adminService.deletePatient(id);
    }

    @PutMapping("/patients/{id}")
    public String updatePatient(
            @PathVariable Long id,

            @Valid @RequestBody UpdatePatientRequest request) {

        return adminService.updatePatient(id, request);
    }

    @PostMapping("/doctors")
    public String addDoctor(
            @Valid @RequestBody AddDoctorRequest request) {

        return adminService.addDoctor(request);
    }

    @GetMapping("/doctors")
    public List<DoctorProfile> getAllDoctors() {

        return adminService.getAllDoctors();
    }

    @DeleteMapping("/doctors/{id}")
    public String deleteDoctor(
            @PathVariable Long id) {

        return adminService.deleteDoctor(id);
    }

    @GetMapping("/doctors/search")
    public List<DoctorProfile> searchDoctors(
            @RequestParam String name) {

        return adminService.searchDoctors(name);
    }

    @PutMapping("/doctors/{id}")
    public String updateDoctor(

            @PathVariable Long id,

            @Valid @RequestBody UpdateDoctorRequest request) {

        return adminService.updateDoctor(id, request);
    }

    @PostMapping("/appointments")
    public String bookAppointment(

            @Valid @RequestBody BookAppointmentRequest request) {

        return adminService.bookAppointment(request);
    }

    @GetMapping("/appointments")
    public List<Appointment> getAllAppointments() {

        return adminService.getAllAppointments();
    }

    @PutMapping("/appointments/cancel/{id}")
    public String cancelAppointment(
            @PathVariable Long id) {

        return adminService.cancelAppointment(id);
    }

    @PutMapping("/appointments/reschedule/{id}")
    public String rescheduleAppointment(

            @PathVariable Long id,

            @Valid @RequestBody RescheduleAppointmentRequest request) {

        return adminService
                .rescheduleAppointment(id, request);
    }

    @PutMapping("/appointments/approve/{id}")
    public String approveAppointment(
            @PathVariable Long id) {

        return adminService.approveAppointment(id);
    }

    @PostMapping("/wards")
    public String addWard(

            @Valid @RequestBody AddWardRequest request) {

        return adminService.addWard(request);
    }

    @PostMapping("/beds")
    public String addBed(

            @Valid @RequestBody AddBedRequest request) {

        return adminService.addBed(request);
    }

    @GetMapping("/beds/available")
    public List<Bed> getAvailableBeds() {

        return adminService.getAvailableBeds();
    }

    @PostMapping("/admissions")
    public String admitPatient(

            @Valid @RequestBody AdmitPatientRequest request) {

        return adminService.admitPatient(request);
    }

    @PutMapping("/admissions/discharge/{patientId}")
    public String dischargePatient(
            @PathVariable Long patientId) {

        return adminService
                .dischargePatient(patientId);
    }

    @GetMapping("/wards/occupancy")
    public List<WardOccupancyResponse> getWardOccupancy() {

        return adminService.getWardOccupancy();
    }

    @PutMapping("/admissions/transfer")
    public String transferPatient(

            @Valid @RequestBody TransferPatientRequest request) {

        return adminService
                .transferPatient(request);
    }

    @GetMapping("/wards")
    public List<Ward> getAllWards() {

        return adminService.getAllWards();
    }

    @PutMapping("/wards/{id}")
    public String updateWard(

            @PathVariable Long id,

            @Valid @RequestBody UpdateWardRequest request) {

        return adminService.updateWard(id, request);
    }

    @DeleteMapping("/wards/{id}")
    public String deleteWard(
            @PathVariable Long id) {

        return adminService.deleteWard(id);
    }

    @PostMapping("/admissions/emergency")
    public String emergencyAdmission(

            @Valid @RequestBody EmergencyAdmissionRequest request) {

        return adminService
                .emergencyAdmission(request);
    }

    @PostMapping("/prescriptions")
    public String createPrescription(

            @Valid @RequestBody CreatePrescriptionRequest request) {

        return adminService
                .createPrescription(request);
    }

    @GetMapping("/prescriptions")
    public List<Prescription> getAllPrescriptions() {

        return adminService.getAllPrescriptions();
    }

    @GetMapping("/patients/{id}/prescriptions")
    public List<Prescription> getPatientPrescriptionHistory(

            @PathVariable Long id) {

        return adminService
                .getPatientPrescriptionHistory(id);
    }

    @PostMapping("/bills")
    public String createBill(

            @Valid @RequestBody CreateBillRequest request) {

        return adminService.createBill(request);
    }

    @GetMapping("/bills")
    public List<Bill> getAllBills() {

        return adminService.getAllBills();
    }

    @PutMapping("/bills/pay/{id}")
    public String payBill(
            @PathVariable Long id) {

        return adminService.payBill(id);
    }

    @GetMapping("/dashboard/stats")
    public DashboardStatsResponse getDashboardStats() {

        return adminService
                .getDashboardStats();
    }

    @PostMapping("/blood-stock")
    public String addBloodStock(

            @Valid @RequestBody AddBloodStockRequest request) {

        return adminService
                .addBloodStock(request);
    }

    @GetMapping("/blood-stock")
    public List<BloodStock> getAllBloodStock() {

        return adminService.getAllBloodStock();
    }

    @PostMapping("/blood-requests")
    public String requestBlood(

            @Valid @RequestBody CreateBloodRequest request) {

        return adminService
                .requestBlood(request);
    }

    @GetMapping("/blood-requests")
    public List<BloodRequest> getAllBloodRequests() {

        return adminService
                .getAllBloodRequests();
    }

    @GetMapping("/blood-stock/{bloodGroup}")
    public BloodAvailabilityResponse checkBloodAvailability(

            @PathVariable String bloodGroup) {

        return adminService
                .checkBloodAvailability(
                        bloodGroup);
    }

    @PostMapping("/donors")
    public String addDonor(

            @Valid @RequestBody AddDonorRequest request) {

        return adminService.addDonor(request);
    }

    @PostMapping("/donations")
    public String donateBlood(

            @Valid @RequestBody DonateBloodRequest request) {

        return adminService
                .donateBlood(request);
    }

    @PutMapping("/users/{id}/role")
    public String updateUserRole(

            @PathVariable Long id,

            @Valid @RequestBody UpdateRoleRequest request) {

        return adminService
                .updateUserRole(id, request);
    }

    @GetMapping("/users/role/{role}")
    public List<User> getUsersByRole(

            @PathVariable String role) {

        return adminService
                .getUsersByRole(role);
    }

    @GetMapping("/profile/{adminId}")
    public User getAdminProfile(

            @PathVariable Long adminId) {

        return adminService
                .getAdminProfile(adminId);
    }

    @PutMapping("/profile/{adminId}")
    public String updateAdminProfile(

            @PathVariable Long adminId,

            @Valid @RequestBody UpdateProfileRequest request) {

        return adminService
                .updateAdminProfile(
                        adminId,
                        request);
    }

    @PutMapping("/profile/{adminId}/password")
    public String changePassword(

            @PathVariable Long adminId,

            @Valid @RequestBody ChangePasswordRequest request) {

        return adminService
                .changePassword(
                        adminId,
                        request);
    }

    @PostMapping("/lab-tests")
    public String createLabTest(

            @Valid @RequestBody CreateLabTestRequest request) {

        return adminService
                .createLabTest(request);
    }

    @GetMapping("/lab-tests")
    public List<LabTest> getAllLabTests() {

        return adminService
                .getAllLabTests();
    }

    @PutMapping("/lab-reports/{id}")
    public String updateLabReport(

            @PathVariable Long id,

            @Valid @RequestBody UpdateLabReportRequest request) {

        return adminService
                .updateLabReport(
                        id,
                        request);
    }

    @PostMapping("/users")
    public String createUserByAdmin(

            @Valid @RequestBody CreateUserRequest request) {

        return adminService
                .createUserByAdmin(
                        request);
    }

}
