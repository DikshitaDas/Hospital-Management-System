package com.example.hms.service;

import com.example.hms.dto.admin.ForgotPasswordRequest;
import com.example.hms.dto.admin.LoginRequest;
import com.example.hms.dto.admin.LoginResponse;
import com.example.hms.dto.admin.RegisterRequest;
import com.example.hms.entity.User;
import com.example.hms.repository.UserRepository;
import com.example.hms.security.JwtService;

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

    @Autowired
    private JwtService jwtService;

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

        user.setRole("PATIENT");

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
                    null,
                    null,
                    null);
        }

        return new LoginResponse(
                "Login Successful!",
                user.getRole(),
                user.getUhid(),
                user.getName(),
                user.getId(),
                jwtService.generateToken(user));
    }

    public String forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByUhid(request.getUhid().trim()).orElse(null);
        if (user == null) {
            return "No account found for this UHID.";
        }
        if (!user.getMobile().equals(request.getMobile().trim())) {
            return "Mobile number does not match our records.";
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return "Password reset successful. You can sign in with your new password.";
    }

    private String generateUHID() {

        Random random = new Random();
        String uhid;

        do {
            int number = 100000 + random.nextInt(900000);
            uhid = "HMS" + number;
        } while (userRepository.existsByUhid(uhid));

        return uhid;
    }
}
