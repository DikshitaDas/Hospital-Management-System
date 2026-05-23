package com.example.hms.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TransferPatientRequest {

    @NotNull
    private Long patientId;

    @NotNull
    private Long newBedId;
}