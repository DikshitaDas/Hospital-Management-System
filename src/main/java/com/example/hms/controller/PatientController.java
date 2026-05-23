package com.example.hms.controller;

import com.example.hms.dto.patient.PatientDashboardResponse;
import com.example.hms.service.PatientService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patient")

public class PatientController {

    @Autowired
    private PatientService patientService;

    @GetMapping("/dashboard/{patientId}")
    public PatientDashboardResponse
    getPatientDashboard(

            @PathVariable Long patientId
    ) {

        return patientService
                .getPatientDashboard(
                        patientId
                );
    }
}