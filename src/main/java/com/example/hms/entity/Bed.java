package com.example.hms.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "beds")

@Data
public class Bed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bedNumber;

    private String status;

    // MANY BEDS -> ONE WARD
    @ManyToOne
    @JoinColumn(name = "ward_id")
    private Ward ward;
}