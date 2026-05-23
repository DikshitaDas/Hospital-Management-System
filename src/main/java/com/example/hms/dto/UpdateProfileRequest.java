package com.example.hms.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String gender;

    @NotNull
    private Integer age;

    @NotBlank
    private String mobile;
}