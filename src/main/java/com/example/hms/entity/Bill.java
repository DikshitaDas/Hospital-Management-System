package com.example.hms.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "bills")

@Data
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;

    private String billType;

    private String status;

    private LocalDate billDate;

    // MANY BILLS -> ONE PATIENT
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private User patient;
}
