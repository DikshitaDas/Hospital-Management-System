package com.example.hms.dto.admin;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AddDoctorRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String gender;

    @NotNull
    private Integer age;

    @Pattern(regexp = "^[0-9]{10}$")
    private String mobile;

    @Size(min = 8)
    private String password;

    @NotBlank
    private String specialization;

    @NotBlank
    private String department;

    @NotNull
    private Double consultationFee;

    @NotBlank
    private String availability;
}