package com.example.hms.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "hospital_profile")
public class HospitalProfile {

    @Id
    private Long id = 1L;

    private String hospitalName;

    private String address;

    private String phone;

    private String email;

    @Column(columnDefinition = "TEXT")
    private String logoDataUrl;
}
