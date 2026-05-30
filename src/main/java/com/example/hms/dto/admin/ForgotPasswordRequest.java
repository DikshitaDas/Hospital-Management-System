package com.example.hms.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ForgotPasswordRequest {

    @NotBlank(message = "UHID is required")
    private String uhid;

    @NotBlank(message = "Registered mobile is required")
    private String mobile;

    @NotBlank
    @Size(min = 8, message = "New password must be at least 8 characters")
    private String newPassword;
}
