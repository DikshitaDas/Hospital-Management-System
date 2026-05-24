package com.example.hms.dto.admin;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RescheduleAppointmentRequest {

    @NotNull
    @FutureOrPresent(message = "Appointment date cannot be in the past")
    private LocalDate appointmentDate;
}
