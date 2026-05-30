package com.example.hms.dto.patient;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PatientBookAppointmentRequest {

    @NotNull
    private Long doctorId;

    @NotNull
    @FutureOrPresent(message = "Appointment date cannot be in the past")
    private LocalDate appointmentDate;
}
