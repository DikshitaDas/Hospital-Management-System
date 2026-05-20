package com.example.hms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    @Column(unique = true)
    private String uhid;

    private String name;

    private String gender;

    private Integer age;

    @Column(unique = true)
    private String mobile;

    private String password;

    private String role;
}