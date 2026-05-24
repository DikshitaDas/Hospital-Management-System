package com.example.hms.dto.Lab;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateLabReportRequest {

    @NotNull
    private Long labTestId;

    @NotNull
    private Long appointmentId;
}