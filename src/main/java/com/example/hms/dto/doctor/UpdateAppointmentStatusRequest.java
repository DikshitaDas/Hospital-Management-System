package com.example.hms.dto.doctor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdateAppointmentStatusRequest {

    @NotBlank
    @Pattern(
            regexp = "^(PENDING|BOOKED|APPROVED|CANCELLED|RESCHEDULED|COMPLETED)$",
            message = "Status must be PENDING, BOOKED, APPROVED, CANCELLED, RESCHEDULED, or COMPLETED"
    )
    private String status;
}
