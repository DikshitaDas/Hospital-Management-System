package com.example.hms.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "blood_requests")

@Data
public class BloodRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bloodGroup;

    private Integer unitsRequired;

    private String status;

    private LocalDate requestDate;

    // MANY REQUESTS -> ONE PATIENT
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private User patient;
}