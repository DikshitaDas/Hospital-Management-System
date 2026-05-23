package com.example.hms.dto.doctor;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdatePrescriptionRequest {

    @NotBlank
    private String diagnosis;

    @NotBlank
    private String medicines;

    @NotBlank
    private String dosageInstructions;
}