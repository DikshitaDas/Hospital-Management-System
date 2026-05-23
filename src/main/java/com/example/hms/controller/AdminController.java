package com.example.hms.controller;

import com.example.hms.dto.AddBedRequest;
import com.example.hms.dto.AddDoctorRequest;
import com.example.hms.dto.AddWardRequest;
import com.example.hms.dto.AdmitPatientRequest;
import com.example.hms.dto.BookAppointmentRequest;
import com.example.hms.dto.EmergencyAdmissionRequest;
import com.example.hms.dto.RescheduleAppointmentRequest;
import com.example.hms.dto.TransferPatientRequest;
import com.example.hms.dto.UpdateDoctorRequest;
import com.example.hms.dto.UpdatePatientRequest;
import com.example.hms.dto.UpdateWardRequest;
import com.example.hms.dto.WardOccupancyResponse;
import com.example.hms.entity.Appointment;
import com.example.hms.entity.Bed;
import com.example.hms.entity.DoctorProfile;
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

}