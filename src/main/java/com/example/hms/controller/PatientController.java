package com.example.hms.controller;

import com.example.hms.dto.admin.BloodAvailabilityResponse;
import com.example.hms.dto.admin.CreateBloodRequest;
import com.example.hms.dto.patient.PatientDashboardResponse;
import com.example.hms.entity.Admission;
import com.example.hms.entity.Appointment;
import com.example.hms.entity.Bill;
import com.example.hms.entity.Prescription;
import com.example.hms.service.PatientService;
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

            @PathVariable Long billId) {

        return patientService
                .payBill(billId);
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
}