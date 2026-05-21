package com.example.hms.service;

import com.example.hms.entity.User;
import com.example.hms.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

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
}