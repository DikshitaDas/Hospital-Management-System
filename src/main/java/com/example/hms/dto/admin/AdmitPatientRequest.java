package com.example.hms.dto.admin;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdmitPatientRequest {

    @NotNull
    private Long patientId;

    @NotNull
    private Long bedId;
}