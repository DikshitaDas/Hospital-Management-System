package com.example.hms.controller;

import com.example.hms.dto.ChangePasswordRequest;
import com.example.hms.dto.UpdateProfileRequest;
import com.example.hms.dto.admin.BloodAvailabilityResponse;
import com.example.hms.dto.admin.CreateBloodRequest;
import com.example.hms.dto.admin.PayBillRequest;
import com.example.hms.dto.admin.BookAppointmentResponse;
import com.example.hms.dto.patient.PatientBookAppointmentRequest;
import com.example.hms.dto.patient.PatientDashboardResponse;
import com.example.hms.entity.DoctorProfile;
import com.example.hms.entity.Admission;
import com.example.hms.entity.Appointment;
import com.example.hms.entity.Bill;
import com.example.hms.entity.LabReport;
import com.example.hms.entity.Prescription;
import com.example.hms.service.PatientService;
import com.example.hms.entity.User;
import com.example.hms.dto.patient.RescheduleAppointmentRequest;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/patient")

public class PatientController {

        @Autowired
        private PatientService patientService;

        @GetMapping("/dashboard/{patientId}")
        public PatientDashboardResponse getPatientDashboard(

                        @PathVariable Long patientId) {

                return patientService
                                .getPatientDashboard(
                                                patientId);
        }

        @GetMapping("/{patientId}/appointments")
        public List<Appointment> getPatientAppointments(

                        @PathVariable Long patientId) {

                return patientService
                                .getPatientAppointments(
                                                patientId);
        }

        @GetMapping("/doctors/search")
        public List<DoctorProfile> searchDoctors(
                        @RequestParam String name) {

                return patientService.searchDoctors(name);
        }

        @PostMapping("/appointments")
        public BookAppointmentResponse bookAppointment(
                        @Valid @RequestBody PatientBookAppointmentRequest request) {

                return patientService.bookAppointment(request);
        }

        @PutMapping("/appointments/{id}/cancel")
        public String cancelAppointment(

                        @PathVariable Long id) {

                return patientService
                                .cancelAppointment(id);
        }

        @PutMapping("/appointments/{id}/reschedule")
        public String rescheduleAppointment(

                        @PathVariable Long id,

                        @Valid @RequestBody RescheduleAppointmentRequest request) {

                return patientService
                                .rescheduleAppointment(
                                                id,
                                                request);
        }

        @GetMapping("/{patientId}/prescriptions")
        public List<Prescription> getPatientPrescriptions(

                        @PathVariable Long patientId) {

                return patientService
                                .getPatientPrescriptions(
                                                patientId);
        }

        @GetMapping("/{patientId}/bills")
        public List<Bill> getPatientBills(

                        @PathVariable Long patientId) {

                return patientService
                                .getPatientBills(
                                                patientId);
        }

        @PutMapping("/bills/{billId}/pay")
        public String payBill(
                        @PathVariable Long billId,
                        @Valid @RequestBody PayBillRequest request) {

                return patientService.payBill(billId, request);
        }

        @GetMapping("/{patientId}/admissions")
        public List<Admission> getPatientAdmissions(

                        @PathVariable Long patientId) {

                return patientService
                                .getPatientAdmissions(
                                                patientId);
        }

        @GetMapping("/blood-stock/{bloodGroup}")
        public BloodAvailabilityResponse checkBloodAvailability(

                        @PathVariable String bloodGroup) {

                return patientService
                                .checkBloodAvailability(
                                                bloodGroup);
        }

        @PostMapping("/blood-requests")
        public String requestBlood(

                        @Valid @RequestBody CreateBloodRequest request) {

                return patientService
                                .requestBlood(request);
        }

        @GetMapping("/profile")
        public User getPatientProfile() {

                return patientService.getPatientProfile();
        }

        @GetMapping("/{patientId}/profile")
        public User getPatientProfileById(
                        @PathVariable Long patientId) {

                return patientService.getPatientProfile(patientId);
        }

        @PutMapping("/profile/{patientId}")
        public String updatePatientProfile(

                        @PathVariable Long patientId,

                        @Valid @RequestBody UpdateProfileRequest request) {

                return patientService
                                .updatePatientProfile(

                                                patientId,

                                                request);
        }

        @PutMapping("/profile/{patientId}/password")
        public String changePatientPassword(

                        @PathVariable Long patientId,

                        @Valid @RequestBody ChangePasswordRequest request) {

                return patientService
                                .changePatientPassword(

                                                patientId,

                                                request);
        }

        @GetMapping("/{patientId}/lab-reports")
        public List<LabReport> getPatientLabReports(

                        @PathVariable Long patientId) {

                return patientService
                                .getPatientLabReports(
                                                patientId);
        }

}