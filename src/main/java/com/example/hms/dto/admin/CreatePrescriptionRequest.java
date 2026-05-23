package com.example.hms.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreatePrescriptionRequest {

    @NotNull
    private Long appointmentId;

    @NotBlank
    private String diagnosis;

    @NotBlank
    private String medicines;

    @NotBlank
    private String dosageInstructions;
}