package com.example.hms.controller;

import com.example.hms.dto.AddDoctorRequest;
import com.example.hms.dto.UpdatePatientRequest;
import com.example.hms.entity.DoctorProfile;
import com.example.hms.entity.User;
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
}