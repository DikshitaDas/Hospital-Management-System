package com.example.hms.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "wards")

@Data
public class Ward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String wardName;

    private String wardType;

    private Integer totalBeds;
}