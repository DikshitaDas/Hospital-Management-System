package com.example.hms.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "donations")

@Data
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer unitsDonated;

    private LocalDate donationDate;

    // MANY DONATIONS -> ONE DONOR
    @ManyToOne
    @JoinColumn(name = "donor_id")
    private Donor donor;
}