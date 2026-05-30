package com.example.hms.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class LoginResponse {

    private String message;

    private String role;

    private String uhid;

    private String name;

    private Long userId;

    private String token;
}
