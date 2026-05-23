package com.example.hms.dto.doctor;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class DoctorDashboardResponse {

    private Long todayAppointments;

    private Long totalPatients;

    private Long pendingReports;
}