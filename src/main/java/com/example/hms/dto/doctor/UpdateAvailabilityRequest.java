package com.example.hms.dto.doctor;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateAvailabilityRequest {

    @NotBlank
    private String availabilityStatus;
}