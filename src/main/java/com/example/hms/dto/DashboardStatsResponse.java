package com.example.hms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class DashboardStatsResponse {

    private Long totalPatients;

    private Long totalDoctors;

    private Long totalAppointments;

    private Double totalRevenue;
}