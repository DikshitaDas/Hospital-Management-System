package com.example.hms.service;

import com.example.hms.dto.ChangePasswordRequest;
import com.example.hms.dto.UpdateProfileRequest;
import com.example.hms.dto.admin.BloodAvailabilityResponse;
import com.example.hms.dto.admin.CreateBloodRequest;
import com.example.hms.dto.doctor.DoctorDashboardResponse;
import com.example.hms.dto.doctor.UpdateAppointmentStatusRequest;
import com.example.hms.dto.doctor.UpdateAvailabilityRequest;
import com.example.hms.dto.doctor.UpdatePrescriptionRequest;
import com.example.hms.entity.Appointment;
import com.example.hms.entity.DoctorProfile;
import com.example.hms.entity.Prescription;
import com.example.hms.repository.AppointmentRepository;
import com.example.hms.repository.DoctorProfileRepository;
import com.example.hms.repository.PrescriptionRepository;
import com.example.hms.repository.UserRepository;
import com.example.hms.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class DoctorService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private DoctorProfileRepository doctorProfileRepository;

    @Autowired
    private AdminService adminService;

    public DoctorDashboardResponse getDoctorDashboard() {

        Long todayAppointments = appointmentRepository.count();

        Long totalPatients = 0L;

        Long pendingReports = 0L;

        return new DoctorDashboardResponse(

                todayAppointments,

                totalPatients,

                pendingReports);
    }

    public List<Appointment> getAllAppointments() {

        return appointmentRepository.findAll();
    }

    public String updateAppointmentStatus(

            Long appointmentId,

            UpdateAppointmentStatusRequest request) {

        Appointment appointment = appointmentRepository
                .findById(appointmentId)
                .orElse(null);

        if (appointment == null) {
            return "Appointment not found!";
        }

        appointment.setStatus(
                request.getStatus());

        appointmentRepository.save(
                appointment);

        return "Appointment status updated successfully!";
    }

    public List<Appointment> getTodayAppointments() {

        return appointmentRepository
                .findByAppointmentDate(
                        LocalDate.now());
    }

    public List<Appointment> searchAppointments(
            String patientName) {

        return appointmentRepository
                .findByPatientNameContainingIgnoreCase(
                        patientName);
    }

    public List<Prescription> getAllPrescriptions() {

        return prescriptionRepository.findAll();
    }

    public String updatePrescription(

            Long prescriptionId,

            UpdatePrescriptionRequest request) {

        Prescription prescription = prescriptionRepository
                .findById(prescriptionId)
                .orElse(null);

        if (prescription == null) {
            return "Prescription not found!";
        }

        // UPDATE DETAILS
        prescription.setDiagnosis(
                request.getDiagnosis());

        prescription.setMedicines(
                request.getMedicines());

        prescription.setDosageInstructions(
                request.getDosageInstructions());

        prescriptionRepository.save(
                prescription);

        return "Prescription updated successfully!";
    }

    public List<User> getDoctorPatients(
            Long doctorId) {

        List<Appointment> appointments = appointmentRepository
                .findByDoctorId(doctorId);

        List<User> patients = new ArrayList<>();

        for (Appointment appointment : appointments) {

            User patient = appointment.getPatient();

            // AVOID DUPLICATES
            if (!patients.contains(patient)) {

                patients.add(patient);
            }
        }

        return patients;
    }

    public List<User> searchDoctorPatients(

            Long doctorId,

            String patientName) {

        List<Appointment> appointments = appointmentRepository

                .findByDoctorIdAndPatientNameContainingIgnoreCase(

                        doctorId,

                        patientName);

        List<User> patients = new ArrayList<>();

        for (Appointment appointment : appointments) {

            User patient = appointment.getPatient();

            // AVOID DUPLICATES
            if (!patients.contains(patient)) {

                patients.add(patient);
            }
        }

        return patients;
    }

    public User getDoctorProfile(
            Long doctorId) {

        return userRepository
                .findById(doctorId)
                .orElse(null);
    }

    public String updateDoctorProfile(

            Long doctorId,

            UpdateProfileRequest request) {

        User doctor = userRepository
                .findById(doctorId)
                .orElse(null);

        if (doctor == null) {
            return "Doctor not found!";
        }

        doctor.setName(request.getName());

        doctor.setGender(request.getGender());

        doctor.setAge(request.getAge());

        doctor.setMobile(request.getMobile());

        userRepository.save(doctor);

        return "Doctor profile updated successfully!";
    }

    public String changeDoctorPassword(

            Long doctorId,

            ChangePasswordRequest request) {

        User doctor = userRepository
                .findById(doctorId)
                .orElse(null);

        if (doctor == null) {
            return "Doctor not found!";
        }

        // CHECK OLD PASSWORD
        boolean matched = passwordEncoder.matches(

                request.getOldPassword(),

                doctor.getPassword());

        if (!matched) {
            return "Old password incorrect!";
        }

        // ENCRYPT NEW PASSWORD
        doctor.setPassword(

                passwordEncoder.encode(
                        request.getNewPassword()));

        userRepository.save(doctor);

        return "Password changed successfully!";
    }

    public String updateAvailability(

            Long doctorId,

            UpdateAvailabilityRequest request) {

        DoctorProfile profile = doctorProfileRepository
                .findByUserId(doctorId)
                .orElse(null);

        if (profile == null) {
            return "Doctor profile not found!";
        }

        profile.setAvailabilityStatus(

                request.getAvailabilityStatus());

        doctorProfileRepository.save(profile);

        return "Availability updated successfully!";
    }

    public BloodAvailabilityResponse checkBloodAvailability(
            String bloodGroup) {

        return adminService
                .checkBloodAvailability(
                        bloodGroup);
    }

    public String requestBlood(
            CreateBloodRequest request) {

        return adminService
                .requestBlood(request);
    }

}