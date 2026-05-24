package com.example.hms.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdateRoleRequest {

    @NotBlank
    @Pattern(
            regexp = "^(ADMIN|DOCTOR|PATIENT)$",
            message = "Role must be ADMIN, DOCTOR, or PATIENT"
    )
    private String role;
}
