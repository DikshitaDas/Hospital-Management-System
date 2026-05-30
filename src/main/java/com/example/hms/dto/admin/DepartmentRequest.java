package com.example.hms.dto.admin;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DepartmentRequest {

    @NotBlank(message = "Department name is required")
    private String name;

    private String description;
}
