package com.example.hms.security;

import com.example.hms.entity.User;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class SecurityUtils {

    public static String getCurrentUhid() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null || authentication.getPrincipal() == null) {
                return null;
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof User user) {
                return user.getUhid();
        }

        if (principal instanceof UserDetails userDetails) {
                return userDetails.getUsername();
        }

        if (principal instanceof String username) {
                return username;
        }

        return null;
    }
}
