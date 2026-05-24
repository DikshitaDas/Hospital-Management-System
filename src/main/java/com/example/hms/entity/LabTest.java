package com.example.hms.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data

public class LabTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    private String testName;

    private String category;

    private Double price;

    private String description;
}