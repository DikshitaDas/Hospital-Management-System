package com.example.hms.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "doctor_profiles")

@Data
public class DoctorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String specialization;

    private String department;

    private Double consultationFee;

    private String availability;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}