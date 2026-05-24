package com.example.hms.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data

public class LabReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    // WHICH TEST
    @ManyToOne
    private LabTest labTest;

    // WHICH APPOINTMENT
    @ManyToOne
    private Appointment appointment;

    // REPORT DETAILS
    private String result;

    // PENDING / COMPLETED
    private String status;
}