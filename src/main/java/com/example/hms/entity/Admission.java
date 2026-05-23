package com.example.hms.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "admissions")

@Data
public class Admission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate admissionDate;

    private LocalDate dischargeDate;

    private String status;

    // MANY ADMISSIONS -> ONE PATIENT
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private User patient;

    // MANY ADMISSIONS -> ONE BED
    @ManyToOne
    @JoinColumn(name = "bed_id")
    private Bed bed;
}