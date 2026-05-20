package com.example.hms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "UHID is required")
    private String uhid;

    @NotBlank(message = "Password is required")
    private String password;
}