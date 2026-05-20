package com.example.hms.service;

import com.example.hms.dto.LoginRequest;
import com.example.hms.dto.LoginResponse;
import com.example.hms.dto.RegisterRequest;
import com.example.hms.entity.User;
import com.example.hms.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // REGISTER
    public String register(RegisterRequest request) {

        if (userRepository.findByMobile(request.getMobile()).isPresent()) {
            return "Mobile number already registered!";
        }

        User user = new User();

        // Generate UHID
        String uhid = generateUHID();

        user.setUhid(uhid);
        user.setName(request.getName());
        user.setGender(request.getGender());
        user.setAge(request.getAge());
        user.setMobile(request.getMobile());

        // Encrypt password
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setRole("ADMIN");

        userRepository.save(user);

        return "Patient Registered Successfully! UHID: " + uhid;
    }

    // LOGIN
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByUhid(request.getUhid())
                .orElse(null);

        if (user == null) {
            return new LoginResponse(
                    "Invalid UHID!",
                    null,
                    null,
                    null);
        }

        boolean matched = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword());

        if (!matched) {
            return new LoginResponse(
                    "Invalid Password!",
                    null,
                    null,
                    null);
        }

        return new LoginResponse(
                "Login Successful!",
                user.getRole(),
                user.getUhid(),
                user.getName());
    }

    private String generateUHID() {

        Random random = new Random();

        int number = 100000 + random.nextInt(900000);

        return "HMS" + number;
    }
}