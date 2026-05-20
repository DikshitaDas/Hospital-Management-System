package com.example.hms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class LoginResponse {

    private String message;

    private String role;

    private String uhid;

    private String name;
}