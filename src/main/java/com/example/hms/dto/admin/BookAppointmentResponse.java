package com.example.hms.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookAppointmentResponse {

    private String message;

    private Long appointmentId;

    private Long billId;

    private Double consultationFee;

    private String billStatus;
}
