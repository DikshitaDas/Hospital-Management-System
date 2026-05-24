package com.example.hms.dto.Lab;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateLabTestRequest {

    @NotBlank
    private String testName;

    @NotBlank
    private String category;

    @NotNull
    private Double price;

    private String description;
}