package com.example.hms.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "prescriptions")

@Data
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String diagnosis;

    private String medicines;

    private String dosageInstructions;

    // ONE PRESCRIPTION -> ONE APPOINTMENT
    @OneToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;
}