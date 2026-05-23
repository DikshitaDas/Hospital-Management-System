package com.example.hms.dto.patient;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class PatientDashboardResponse {

    private Long totalAppointments;

    private Long totalPrescriptions;

    private Long pendingBills;

    private Boolean admitted;
}