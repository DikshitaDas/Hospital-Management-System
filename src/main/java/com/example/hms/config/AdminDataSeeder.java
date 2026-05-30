package com.example.hms.config;

import com.example.hms.entity.User;
import com.example.hms.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${hms.seed.admin.uhid:ADMIN001}")
    private String adminUhid;

    @Value("${hms.seed.admin.password:admin123}")
    private String adminPassword;

    @Value("${hms.seed.admin.name:System Administrator}")
    private String adminName;

    @Value("${hms.seed.admin.mobile:9000000001}")
    private String adminMobile;

    public AdminDataSeeder(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByRole("ADMIN").stream().findAny().isPresent()) {
            return;
        }

        if (userRepository.findByUhid(adminUhid).isPresent()) {
            return;
        }

        User admin = new User();
        admin.setUhid(adminUhid);
        admin.setName(adminName);
        admin.setGender("Other");
        admin.setAge(30);
        admin.setMobile(adminMobile);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRole("ADMIN");

        userRepository.save(admin);

        System.out.println(
                "Seeded default admin — UHID: " + adminUhid + " (change password after first login)");
    }
}
