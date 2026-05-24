package com.example.hms.config;

import com.example.hms.repository.UserRepository;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(
            UserRepository userRepository) {

        return uhid -> userRepository.findByUhid(uhid)
                .map(user -> new org.springframework.security.core.userdetails.User(
                        user.getUhid(),
                        user.getPassword(),
                        List.of(new SimpleGrantedAuthority(
                                "ROLE_" + user.getRole()))))
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with UHID: " + uhid));
    }
}
