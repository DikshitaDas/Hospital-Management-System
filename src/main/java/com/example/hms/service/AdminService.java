package com.example.hms.service;

import com.example.hms.dto.AddDoctorRequest;
import com.example.hms.dto.UpdatePatientRequest;
import com.example.hms.entity.DoctorProfile;
import com.example.hms.entity.User;
import com.example.hms.repository.DoctorProfileRepository;
import com.example.hms.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorProfileRepository doctorProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Get all patients
    public List<User> getAllPatients() {

        return userRepository.findByRole("PATIENT");
    }

    public List<User> searchPatients(String name) {

        return userRepository
                .findByNameContainingIgnoreCaseAndRole(
                        name,
                        "PATIENT");
    }

    public String deletePatient(Long id) {

        User user = userRepository.findById(id)
                .orElse(null);

        if (user == null) {
            return "Patient not found!";
        }

        userRepository.delete(user);

        return "Patient deleted successfully!";
    }

    public String updatePatient(
            Long id,
            UpdatePatientRequest request) {

        User user = userRepository.findById(id)
                .orElse(null);

        if (user == null) {
            return "Patient not found!";
        }

        user.setName(request.getName());
        user.setGender(request.getGender());
        user.setAge(request.getAge());
        user.setMobile(request.getMobile());

        userRepository.save(user);

        return "Patient updated successfully!";
    }

    public String addDoctor(AddDoctorRequest request) {

        if (userRepository.findByMobile(request.getMobile()).isPresent()) {
            return "Mobile already registered!";
        }

        // CREATE USER
        User user = new User();

        user.setUhid(generateUHID());
        user.setName(request.getName());
        user.setGender(request.getGender());
        user.setAge(request.getAge());
        user.setMobile(request.getMobile());

        user.setPassword(
                passwordEncoder.encode(request.getPassword()));

        user.setRole("DOCTOR");

        User savedUser = userRepository.save(user);

        // CREATE DOCTOR PROFILE
        DoctorProfile doctorProfile = new DoctorProfile();

        doctorProfile.setSpecialization(
                request.getSpecialization());

        doctorProfile.setDepartment(
                request.getDepartment());

        doctorProfile.setConsultationFee(
                request.getConsultationFee());

        doctorProfile.setAvailability(
                request.getAvailability());

        // RELATIONSHIP
        doctorProfile.setUser(savedUser);

        doctorProfileRepository.save(doctorProfile);

        return "Doctor added successfully!";
    }

    private String generateUHID() {

        Random random = new Random();

        int number = 100000 + random.nextInt(900000);

        return "HMS" + number;
    }

    public List<DoctorProfile> getAllDoctors() {

        return doctorProfileRepository.findAll();
    }

}