package com.example.hms.controller;

import com.example.hms.dto.ChangePasswordRequest;
import com.example.hms.dto.admin.CreateBloodRequest;
import com.example.hms.dto.doctor.DoctorDashboardResponse;
import com.example.hms.dto.doctor.UpdateAppointmentStatusRequest;
import com.example.hms.dto.doctor.UpdateAvailabilityRequest;
import com.example.hms.dto.doctor.UpdatePrescriptionRequest;
import com.example.hms.entity.Appointment;
import com.example.hms.entity.Prescription;
import com.example.hms.entity.User;
import com.example.hms.service.DoctorService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/doctor")

public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping("/dashboard")
    public DoctorDashboardResponse getDoctorDashboard() {

        return doctorService
                .getDoctorDashboard();
    }

    @GetMapping("/appointments")
    public List<Appointment> getAllAppointments() {

        return doctorService
                .getAllAppointments();
    }

    @PutMapping("/appointments/{id}/status")
    public String updateAppointmentStatus(

            @PathVariable Long id,

            @Valid @RequestBody UpdateAppointmentStatusRequest request) {

        return doctorService
                .updateAppointmentStatus(
                        id,
                        request);
    }

    @GetMapping("/appointments/today")
    public List<Appointment> getTodayAppointments() {

        return doctorService
                .getTodayAppointments();
    }

    @GetMapping("/appointments/search")
    public List<Appointment> searchAppointments(

            @RequestParam String name) {

        return doctorService
                .searchAppointments(name);
    }

    @GetMapping("/prescriptions")
    public List<Prescription> getAllPrescriptions() {

        return doctorService
                .getAllPrescriptions();
    }

    @PutMapping("/prescriptions/{id}")
    public String updatePrescription(

            @PathVariable Long id,

            @Valid @RequestBody UpdatePrescriptionRequest request) {

        return doctorService
                .updatePrescription(
                        id,
                        request);
    }

    @GetMapping("/{doctorId}/patients")
    public List<User> getDoctorPatients(

            @PathVariable Long doctorId) {

        return doctorService
                .getDoctorPatients(
                        doctorId);
    }

    @GetMapping("/{doctorId}/patients/search")
    public List<User> searchDoctorPatients(

            @PathVariable Long doctorId,

            @RequestParam String name) {

        return doctorService
                .searchDoctorPatients(

                        doctorId,

                        name);
    }

    @GetMapping("/profile/{doctorId}")
    public User getDoctorProfile(

            @PathVariable Long doctorId) {

        return doctorService
                .getDoctorProfile(
                        doctorId);
    }

    @PutMapping("/profile/{doctorId}/password")
    public String changeDoctorPassword(

            @PathVariable Long doctorId,

            @Valid @RequestBody ChangePasswordRequest request) {

        return doctorService
                .changeDoctorPassword(

                        doctorId,

                        request);
    }

    @PutMapping("/profile/{doctorId}/availability")
    public String updateAvailability(

            @PathVariable Long doctorId,

            @Valid @RequestBody UpdateAvailabilityRequest request) {

        return doctorService
                .updateAvailability(

                        doctorId,

                        request);
    }

    @GetMapping("/blood-stock/{bloodGroup}")
    public String checkBloodStock(

            @PathVariable String bloodGroup) {

        return doctorService
                .checkBloodStock(bloodGroup);
    }

    @PostMapping("/blood-requests")
    public String requestBlood(

            @Valid @RequestBody CreateBloodRequest request) {

        return doctorService
                .requestBlood(request);
    }


    





}