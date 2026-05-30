package com.example.hms.dto.admin;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SpecializationRequest {

    @NotBlank(message = "Specialization name is required")
    private String name;

    private Long departmentId;
}
