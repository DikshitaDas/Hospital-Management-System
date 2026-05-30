package com.example.hms.dto.admin;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class HospitalProfileRequest {

    @NotBlank(message = "Hospital name is required")
    private String hospitalName;

    private String address;

    private String phone;

    private String email;

    private String logoDataUrl;
}
