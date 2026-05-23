package com.example.hms.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EmergencyAdmissionRequest {

    @NotNull
    private Long patientId;

    @NotBlank
    private String wardType;
}