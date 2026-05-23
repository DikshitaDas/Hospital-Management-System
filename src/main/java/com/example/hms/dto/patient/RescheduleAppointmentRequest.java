package com.example.hms.dto.patient;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RescheduleAppointmentRequest {

    @NotNull
    private LocalDate appointmentDate;
}