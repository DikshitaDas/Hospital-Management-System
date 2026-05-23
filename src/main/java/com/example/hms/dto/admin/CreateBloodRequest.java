package com.example.hms.dto.admin;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateBloodRequest {

    @NotNull
    private Long patientId;

    @NotBlank
    private String bloodGroup;

    @NotNull
    @Min(1)
    private Integer unitsRequired;
}