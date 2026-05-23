package com.example.hms.dto.admin;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddDonorRequest {

    @NotBlank
    private String donorName;

    @NotBlank
    private String bloodGroup;

    @NotBlank
    private String mobile;
}