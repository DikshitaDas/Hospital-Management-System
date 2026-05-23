package com.example.hms.dto.admin;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdateDoctorRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String gender;

    @NotNull
    private Integer age;

    @Pattern(regexp = "^[0-9]{10}$")
    private String mobile;

    @NotBlank
    private String specialization;

    @NotBlank
    private String department;

    @NotNull
    private Double consultationFee;

    @NotBlank
    private String availability;
}