package com.example.hms.dto.doctor;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateAppointmentStatusRequest {

    @NotBlank
    private String status;
}