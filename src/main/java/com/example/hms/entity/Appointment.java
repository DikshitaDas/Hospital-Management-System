package com.example.hms.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "appointments")

@Data
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate appointmentDate;

    private String status;

    private Integer tokenNumber;

    // MANY APPOINTMENTS -> ONE PATIENT
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private User patient;

    // MANY APPOINTMENTS -> ONE DOCTOR
    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private User doctor;
}